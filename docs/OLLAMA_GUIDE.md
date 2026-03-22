# Ollama 本地部署配置指南

> 本指南帮助你从零开始配置 Ollama，让 ResumeAI 使用本地 AI 模型，保护你的隐私安全。

---

## 📋 目录

1. [为什么使用 Ollama](#为什么使用-ollama)
2. [安装 Ollama](#安装-ollama)
3. [显卡检测与模型选择](#显卡检测与模型选择)
4. [下载推荐模型](#下载推荐模型)
5. [配置 ResumeAI 连接 Ollama](#配置-resumeai-连接-ollama)
6. [测试验证](#测试验证)
7. [常见问题](#常见问题)

---

## 为什么使用 Ollama

### ✅ 优势

| 特性 | 云端 API | Ollama 本地 |
|------|----------|-------------|
| **隐私安全** | ❌ 数据上传到第三方 | ✅ 数据留在本地 |
| **费用** | ❌ 按使用量付费 | ✅ 完全免费 |
| **网络要求** | ❌ 需要稳定网络 | ✅ 离线可用 |
| **速度** | ⚠️ 取决于网络 | ✅ 本地计算，稳定 |
| **数据安全** | ⚠️ 简历可能泄露 | ✅ 简历不出本地 |

### ⚠️ 要求

- 需要一台有 GPU 的电脑（NVIDIA 显卡推荐）
- 至少 8GB 显存可运行基础模型
- 足够的硬盘空间（每个模型 2-10GB）

---

## 安装 Ollama

### Windows

1. 访问 [ollama.com/download](https://ollama.com/download)
2. 点击 **Download for Windows**
3. 运行安装程序
4. 安装完成后，打开命令提示符，输入：
   ```bash
   ollama --version
   ```
   如果显示版本号，说明安装成功

### macOS

1. 访问 [ollama.com/download](https://ollama.com/download)
2. 点击 **Download for Mac**
3. 打开下载的 `.dmg` 文件
4. 将 Ollama 拖到 Applications 文件夹
5. 打开终端，输入：
   ```bash
   ollama --version
   ```

### Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

---

## 显卡检测与模型选择

### 步骤 1：检查你的显卡

#### Windows

1. 右键点击桌面 → **NVIDIA 控制面板**
2. 左下角查看显卡型号和显存大小

或者打开命令提示符：

```bash
nvidia-smi
```

输出示例：
```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 535.154.05   Driver Version: 535.154.05   CUDA Version: 12.2     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  NVIDIA GeForce ...  Off  | 00000000:01:00.0  On |                  N/A |
| 30%   45C    P8    15W / 170W |    512MiB /  8192MiB |      4%      Default |
+-------------------------------+----------------------+----------------------+
```

关键信息：
- **GPU Name**: 显卡型号（如 RTX 4060）
- **Memory-Usage**: 显存使用情况（如 8192MiB = 8GB）

#### macOS

Apple Silicon 芯片（M1/M2/M3）使用统一内存：

```bash
system_profiler SPHardwareDataType | grep "Memory"
```

### 步骤 2：根据显卡选择模型

| 显存大小 | 推荐模型参数量 | 模型示例 |
|----------|----------------|----------|
| **4GB** | 3B-4B | phi3:mini, gemma:2b |
| **6GB** | 5B-7B | mistral:7b-q4, qwen2.5:7b-q4 |
| **8GB** | 7B-9B | llama3.1:8b, qwen2.5:7b, mistral:7b |
| **12GB** | 11B-14B | qwen2.5:14b, mistral-nemo:12b |
| **16GB** | 14B-20B | qwen2.5:14b, command-r:35b-q4 |
| **24GB+** | 30B-70B | llama3.1:70b-q4, qwen2.5:32b |

### 步骤 3：ResumeAI 推荐配置

#### 🎮 RTX 3060 / 4060 (8GB VRAM)

```yaml
# 适合入门级显卡
primary: "qwen2.5:7b"        # 中文理解
reasoning: "mistral:7b"      # 推理分析
generation: "llama3.1:8b"    # 内容生成
fast: "phi3:mini"            # 快速任务
```

#### 🎮 RTX 3070 / 4070 (12GB VRAM)

```yaml
# 适合中端显卡
primary: "qwen2.5:14b"       # 更强的中文理解
reasoning: "mistral-nemo:12b"
generation: "llama3.1:8b"
fast: "phi3:mini"
```

#### 🎮 RTX 3080 / 4080 (16GB VRAM)

```yaml
# 适合高端显卡
primary: "qwen2.5:14b"
reasoning: "deepseek-r1:14b"
generation: "qwen2.5:14b"
vision: "llava:13b"          # 视觉模型
```

#### 🎮 RTX 3090 / 4090 (24GB+ VRAM)

```yaml
# 适合旗舰显卡
primary: "qwen2.5:32b"
reasoning: "deepseek-r1:32b"
generation: "qwen2.5:32b"
vision: "llava:34b"
```

#### 🍎 Apple Silicon (M1/M2/M3)

统一内存决定模型大小：

| 统一内存 | 推荐模型 |
|----------|----------|
| 8GB | phi3:mini, gemma:2b |
| 16GB | qwen2.5:7b, mistral:7b |
| 32GB | qwen2.5:14b, llama3.1:8b |
| 64GB+ | qwen2.5:32b, deepseek-r1:32b |

---

## 下载推荐模型

### 基础模型（必装）

```bash
# 中文理解（推荐）
ollama pull qwen2.5:7b

# 推理分析
ollama pull mistral:7b

# 内容生成
ollama pull llama3.1:8b

# 快速任务
ollama pull phi3:mini
```

### 视觉模型（可选，用于图片/PDF OCR）

```bash
# 7B 版本（8GB 显存推荐）
ollama pull llava:7b

# 13B 版本（16GB+ 显存）
ollama pull llava:13b
```

### 嵌入模型（用于语义搜索）

```bash
ollama pull nomic-embed-text
```

### 查看已下载模型

```bash
ollama list
```

输出示例：
```
NAME                    ID              SIZE    MODIFIED
qwen2.5:7b              ddsdfsdf        4.7 GB  2 hours ago
mistral:7b              fdfsdfds        4.1 GB  2 hours ago
llama3.1:8b             sdfdsfds        4.9 GB  2 hours ago
phi3:mini               dsfdsfds        2.2 GB  2 hours ago
```

### 删除不需要的模型

```bash
ollama rm 模型名称
```

---

## 配置 ResumeAI 连接 Ollama

### 方法 1：通过设置页面（推荐）

1. 打开 ResumeAI 应用
2. 进入 **设置** 页面
3. 点击 **添加 AI 提供商**
4. 选择 **Ollama（本地）**
5. 填写配置：

| 字段 | 值 |
|------|-----|
| 名称 | Ollama 本地 |
| API 地址 | `http://localhost:11434` |
| 默认模型 | `qwen2.5:7b` |

6. 点击 **测试连接**
7. 连接成功后，点击 **保存**

### 方法 2：手动配置

编辑配置文件（如果需要）：

```yaml
# ~/.resumeai/config.yaml
providers:
  - name: "Ollama 本地"
    type: "ollama"
    baseUrl: "http://localhost:11434"
    defaultModel: "qwen2.5:7b"
    models:
      - qwen2.5:7b
      - mistral:7b
      - llama3.1:8b
      - phi3:mini
```

### 模型分配建议

在 ResumeAI 中，你可以为不同任务指定不同模型：

| 任务 | 推荐模型 | 原因 |
|------|----------|------|
| **简历解析** | qwen2.5:7b | 中文理解强，结构化输出好 |
| **JD 分析** | mistral:7b | 推理能力强，英文理解好 |
| **简历生成** | llama3.1:8b | 写作流畅，质量高 |
| **面试题生成** | mistral:7b | 推理能力强 |
| **快速分类** | phi3:mini | 速度极快 |

---

## 测试验证

### 1. 测试 Ollama 运行

```bash
# 运行交互式对话
ollama run qwen2.5:7b

# 输入测试问题
>>> 你好，请用中文介绍一下你自己
```

### 2. 测试 API 连接

```bash
# 测试 Ollama API 是否正常
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:7b",
  "prompt": "你好"
}'
```

### 3. 在 ResumeAI 中测试

1. 进入 **AI 助手** 页面
2. 点击 **简历导入**
3. 上传一个测试简历
4. 观察是否正常解析

---

## 常见问题

### Q1: 显存不足怎么办？

**症状：**
```
CUDA out of memory
```

**解决方案：**

1. 使用更小的模型：
   ```bash
   # 从 7B 换到 3B
   ollama pull phi3:mini
   ```

2. 使用量化版本：
   ```bash
   # Q4 量化更省显存
   ollama pull qwen2.5:7b-q4_0
   ```

3. 减少 GPU 层数（让 CPU 分担）：
   ```bash
   Ollama 会自动处理，但会变慢
   ```

### Q2: 模型下载速度慢？

**原因：** 模型文件很大（2-10GB）

**解决方案：**

1. 使用国内镜像（如果有）
2. 等待下载完成
3. 或使用更小的模型

### Q3: macOS 上运行慢？

**原因：** Apple Silicon 使用 CPU+GPU 统一内存

**解决方案：**

1. 使用 Metal 加速（Ollama 自动支持）
2. 关闭其他占用内存的应用
3. 使用更小的模型

### Q4: 如何查看模型运行状态？

```bash
# 查看正在运行的模型
ollama ps

# 查看详细信息
ollama show 模型名称
```

### Q5: 如何更新模型？

```bash
# 重新 pull 即可更新
ollama pull qwen2.5:7b
```

### Q6: ResumeAI 找不到 Ollama？

**检查清单：**

1. ✅ Ollama 是否正在运行？
   ```bash
   ollama list
   ```

2. ✅ API 端口是否正确？
   - 默认：`http://localhost:11434`

3. ✅ 防火墙是否阻止？
   - Windows: 允许 Ollama 通过防火墙
   - macOS: 系统偏好设置 → 安全性与隐私

### Q7: 如何卸载 Ollama？

**Windows:**
- 控制面板 → 程序与功能 → 卸载 Ollama

**macOS:**
- 删除 Applications 中的 Ollama
- 删除模型文件：
  ```bash
  rm -rf ~/.ollama
  ```

**Linux:**
```bash
rm -rf /usr/local/bin/ollama
rm -rf ~/.ollama
```

---

## 🎯 快速检查清单

完成以下步骤后，你的 Ollama 就配置好了：

- [ ] 安装 Ollama 成功（`ollama --version`）
- [ ] 显卡检测完成（`nvidia-smi`）
- [ ] 下载至少一个模型（`ollama pull qwen2.5:7b`）
- [ ] 测试模型运行（`ollama run qwen2.5:7b`）
- [ ] ResumeAI 设置中添加 Ollama 提供商
- [ ] 测试连接成功
- [ ] 尝试简历导入功能

---

## 📚 更多资源

- [Ollama 官方文档](https://github.com/ollama/ollama)
- [Ollama 模型库](https://ollama.com/library)
- [ResumeAI 使用指南](./README.md)

---

**祝你使用愉快！如有问题，请在 GitHub Issues 中反馈。**