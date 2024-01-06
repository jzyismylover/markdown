> 计量指标提取工具后端应用设计的一些记录

![无标题-2023-06-17-1439](/home/jzy/Documents/markdown/indicator-app/indicator-app.assets/01.png)

## 用户信息

从用户信息来看总体其实也没有用到什么新鲜点，鉴权依旧是使用 `jwt`，可能之前没有接触的是 `邮箱认证`，具体的逻辑就是当用户注册的时候发送一个 `六位数`验证码。

### jwt

<img src="/home/jzy/Documents/markdown/indicator-app/indicator-app.assets/02.png" style="display: block; margin: auto;"/>

对于业务内需要保护的 `api` 基本都需遵循这套流程，即使用前都需要校验 `token`。当然如何去鉴定的问题就是 `jwt` 包所处理的事情。

- Q：实际在生成 `token` 时，我之前还一直纳闷就是为什么每次生成的 `token` 都不一样（即使我传入了相同的 `user_id`）。其实是在注入 `payload` 的时候 `exp` 每次都不一样

```python
def create_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
        # 时间变化导致每次生成token签名不一样
    }
    token = jwt.encode(payload=payload, key=SALT, algorithm='HS256')

    return token
```

### 邮箱认证

验证逻辑

1. 基于 `uuid.uuid4()` 截取 6 位生成 `hash`
2. 发送出去同时将 `hash` 存储在 `redis` 中，当然也必须对验证码设定一个过期期限，因此实际存进去的是一个 `dict`，包含生成的时间以及具体 `hash`

```python
mark_dyn_data(email, {'update_time': time.time(), 'code': captcha})
```

3. 认证时根据传入邮箱从 `redis` 获取 `hash` 判断传入与当前值是否相同

### 操作历史

在文本语种识别模块需要记录下用户输入文本，因此需要新建一个 `history` 表存储. 逻辑不难唯一需要注意的是在获取 用户`history`必须基于 `user_id` 进行获取。

```python
def get_history_rows(user_id):
    with Session(engine) as session:
        stmt = select(History).where(History.user_id == user_id)
        rows = session.execute(stmt).all()
        rows = list(rows)[-10:]
        histories = []
        # 实际每个item都是(..., )元组
        for item in rows:
            item = item[0]
            # 每个表的字段
            # id
            # lg_text
            # lg_type
            # user_id 标明是哪一个用户创建
            histories.append(
                {
                    'id': item.id,
                    'lg_text': item.content,
                    'lg_type': item.type,
                }
            )
    return histories
```

## 指标提取

### celery

> python 异步实现，在程序中主要体现是不阻塞应用程序执行将任务交给后台 `worker` 进程处理

实际使用的难点在数据序列化问题： 对于 `File` 无法找到一个比较好的序列方式。当尝试把 `File` 内容读取为二进制再放入序列化时会发现报错，因为 `celery` 默认的序列化方式为 `json`，`json` 不支持序列化二进制内容。因此最后采取的策略就是通过传入 `二进制 hash` 的方式

```python
file.read().hex() # 传入
bytes.fromhex(file['data']) # 读取
```

尝试这个方法前，其实也想使用 `decode` / `encode` 的方式基于 `unicode`

- decode() 方法用于将 bytes 类型的二进制数据转换为 str 类型，这个过程也称为“解码”
- encode() 方法为字符串类型（str）提供的方法，用于将 str 类型转换成 bytes 类型，这个过程也称为“编码”

```python
file.read().decode(encoding='utf-8')
```

使用的时候会发现针对英文或者中文这样的编码解码过程没有问题，但是对于一些小众语种文本可能就没办法正常处理（小语种文本），解码生成的 str 无法编码成功，生成 `File` 时出现乱码。

> 回到 celery 的知识，celery 主要由 broker、backend、worker 组成

- `broker`： 任务中心，存储任务列表
- `backend`： 结果中心，存储任务执行结果
- `worker`： 具体执行任务的进程或者线程

```python
celery = Celery(
    os.environ['CELERY_NAME'],
    broker=os.environ['CELERY_BROKER_URL'],
    backend=os.environ['CELERY_RESULT_BACKEND'],
    # result_extended=True
)
```

## 文本处理

> 该模块也是花的时间最多的地方，不是也别熟悉 `nlp` 中文本分句以及文本分词模块

### 西方语种文本

可基于 `nltk` 处理，分句大多数基于 `['.', ',', '!', '?', '\n']` 切割。但需要注意的是有些缩写像 `Mr.sun` 这种是不能切割，因此需要去定义一些规则去避免对 `.` 的完全切割。

```python
EN_SPECIAL_WORDS = ['.', ',', '!', '?', '\n']
class ENUtils(BaseUtils):
    def get_sentences(self, text):
        tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')
        sentences = tokenizer.tokenize(text)
        return sentences

    def get_words(self, sentences):
        all_words = []
        for sentence in sentences:
            words = word_tokenize(sentence, preserve_line=True)
            filtered_words = []
            for word in words:
                if re.search('[a-zA-Z0-9]', word) is None:
                    pass
                else:
                    for _ in EN_SPECIAL_WORDS:
                        word = word.replace(_, '') # 标点去除
                    filtered_words.append(word.lower())
            all_words.extend(filtered_words)
        return all_words
```

### 小语种文本

> 对于小语种的文本处理，分词的话更多是基于网上一些深度学习框架（基于多语种训练的 `hanlp`）。分句如果不是特别在于追求高精度的话可以通过自定义分割符进行切割

```python
# 缅甸语
class BUUtils():
    def get_sentences(self, text):
        """
        ။(taa gun)：用于分割句子。相当于英文中的句号。
        ၊(nya yit)：用于分割短语或词组。相当于英文中的逗号。
        ၍(lae gyi)：用于表示省略或缩写。相当于英文中的省略号或缩写号。
        """
        sentence_breaks = r'([။၊၍?!,])'
        text = str(text)
        # 保留原符号
        text = re.sub(sentence_breaks, '\g<1><space break>', text)
        sentences = re.split('<space break>', text)
        return sentences
```

### 中文

```python
class ZHUtils(BaseUtils):
    def get_sentences(self, text):
        # 考虑对 ...... 的处理
        p = re.compile(r'(“.*?”)|(.*?[。！？…]{1,2}”?)')
        sentences = []
        for i in p.finditer(text):
            temp = ''
            start = i.start()
            end = i.end()
            for k in range(start, end):
                temp += text[k]
            if temp != '':
                sentences.append(temp)

        return sentences

    def get_words(self, sentences, is_cut_word=True) -> list:
        words = []
        for sentence in sentences:
            if is_cut_word == False:
                words.extend(i for i in convert(sentence, 'zh-cn').strip().split(' '))
            else:
                words.extend(
                    [i for i in jieba.cut(sentence.strip()) if i not in SYMBOLS]
                )
        return words
```
