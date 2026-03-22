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

Apple Silicon 芯片（M1/M2/M3/M4）使用统一内存：

```bash
system_profiler SPHardwareDataType | grep "Memory"
```

### 步骤 2：根据显存选择模型（2025 最新）

> 💡 **量化说明**：Q4 = 4-bit 量化，节省 ~70% 显存，性能损失 <5%

| 显存大小 | 推荐模型 | 备选模型 | 说明 |
|----------|----------|----------|------|
| **4GB** | `qwen3:0.6b` | `phi4:mini`, `gemma3:1b` | 入门级，适合快速任务 |
| **6GB** | `qwen3:1.7b` | `llama3.2:3b`, `gemma3:4b` | 轻量级，日常可用 |
| **8GB** | `qwen3:4b` | `llama3.1:8b`, `mistral:7b` | 主流推荐，性价比高 |
| **10GB** | `qwen3:8b` | `qwen3.5:7b`, `deepseek-r1:8b` | 中端显卡，能力增强 |
| **12GB** | `qwen3:8b` | `deepseek-r1:14b-q4`, `gemma3:12b` | 推荐配置，推理能力强 |
| **16GB** | `qwen3:14b` | `deepseek-r1:14b`, `qwen3.5:14b` | 高端显卡，高质量输出 |
| **24GB** | `qwen3:30b-q4` | `deepseek-r1:32b-q4`, `llama3.1:70b-q4` | 旗舰显卡，接近 GPT-4 |
| **48GB+** | `qwen3:30b` | `deepseek-r1:70b-q4`, `llama3.1:70b` | 专业级，最佳性能 |

### 步骤 3：ResumeAI 推荐配置（按显卡型号）

#### 🎮 RTX 3050 / 4050 (6GB VRAM)

```yaml
# 入门级显卡 - 使用小模型
primary: "qwen3:1.7b"       # 中文理解
generation: "llama3.2:3b"   # 内容生成
fast: "phi4:mini"           # 快速任务
```

#### 🎮 RTX 3060 / 4060 (8GB VRAM) ⭐ 推荐

```yaml
# 主流显卡 - 性价比之选
primary: "qwen3:4b"         # 最新 Qwen3，中文能力强
reasoning: "deepseek-r1:8b" # DeepSeek R1 推理能力强
generation: "llama3.1:8b"   # 写作流畅
fast: "gemma3:4b"           # 快速任务
```

#### 🎮 RTX 3070 / 4070 (12GB VRAM)

```yaml
# 中端显卡 - 能力增强
primary: "qwen3:8b"         # 更强的中文理解
reasoning: "deepseek-r1:14b-q4"  # 量化版，推理能力强
generation: "qwen3:8b"
fast: "phi4:mini"
```

#### 🎮 RTX 3080 / 4080 (16GB VRAM)

```yaml
# 高端显卡 - 高质量输出
primary: "qwen3:14b"        # 高质量中文理解
reasoning: "deepseek-r1:14b"     # 完整版推理
generation: "qwen3.5:14b"   # 最新版生成
vision: "llava:13b"         # 视觉模型（PDF/图片 OCR）
```

#### 🎮 RTX 3090 / 4090 (24GB VRAM)

```yaml
# 旗舰显卡 - 接近 GPT-4 性能
primary: "qwen3:30b-q4"     # 大模型量化版
reasoning: "deepseek-r1:32b-q4"  # 推理能力接近 GPT-4
generation: "qwen3:30b-q4"
vision: "llava:34b"
```

#### 🍎 Apple Silicon (M1/M2/M3/M4)

统一内存决定模型大小，Metal 加速自动支持：

| 统一内存 | 推荐模型 | 备选 |
|----------|----------|------|
| **8GB** | `qwen3:1.7b` | `phi4:mini`, `gemma3:4b` |
| **16GB** | `qwen3:4b` | `llama3.1:8b`, `deepseek-r1:8b` |
| **24GB** | `qwen3:8b` | `qwen3.5:7b`, `gemma3:12b` |
| **32GB** | `qwen3:14b` | `deepseek-r1:14b` |
| **48GB** | `qwen3:30b-q4` | `deepseek-r1:32b-q4` |
| **64GB+** | `qwen3:30b` | `deepseek-r1:70b-q4` |

---

## 下载推荐模型

### 🆕 2025 最新模型

```bash
# Qwen3 系列（推荐，中文最强）
ollama pull qwen3:4b        # 8GB 显存推荐
ollama pull qwen3:8b        # 12GB 显存推荐
ollama pull qwen3:14b       # 16GB 显存推荐

# Qwen3.5 系列（最新，多模态）
ollama pull qwen3.5:7b      # 支持文本+图片，256K 上下文
ollama pull qwen3.5:14b

# DeepSeek R1 系列（推理最强）
ollama pull deepseek-r1:8b  # 推理能力强
ollama pull deepseek-r1:14b # 接近 GPT-4 推理能力
ollama pull deepseek-r1:32b # 旗舰级推理

# Llama 3.1 系列（综合能力强）
ollama pull llama3.1:8b     # 主流推荐
ollama pull llama3.2:3b     # 轻量版

# Gemma 3 系列（Google 最新）
ollama pull gemma3:4b       # 适合写作
ollama pull gemma3:12b      # 中等规模

# 快速模型
ollama pull phi4:mini       # 速度极快，质量不错
```

### 按用途选择模型

| 用途 | 推荐模型 | 原因 |
|------|----------|------|
| **简历解析** | `qwen3:4b` | 中文理解强，结构化输出好 |
| **JD 分析** | `deepseek-r1:8b` | 推理能力强，匹配分析准确 |
| **简历生成** | `qwen3.5:7b` | 写作流畅，支持多模态 |
| **面试题生成** | `deepseek-r1:8b` | 推理能力强，问题深入 |
| **快速分类** | `phi4:mini` | 速度极快，省显存 |
| **PDF OCR** | `llava:13b` | 视觉模型，支持图片识别 |

### 视觉模型（可选，用于图片/PDF OCR）

```bash
# LLaVA 系列（视觉理解）
ollama pull llava:7b        # 8GB 显存
ollama pull llava:13b       # 16GB 显存
ollama pull llava:34b       # 24GB+ 显存

# Qwen2.5-VL（多模态）
ollama pull qwen2.5-vl:7b   # 视觉+文本
```

### 查看已下载模型

```bash
ollama list
```

输出示例：
```
NAME                    ID              SIZE    MODIFIED
qwen3:4b                ddsdfsdf        2.5 GB  2 hours ago
deepseek-r1:8b          fdfsdfds        4.9 GB  1 day ago
llama3.1:8b             sdfdsfds        4.9 GB  3 days ago
phi4:mini               dsfdsfds        2.2 GB  1 week ago
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
| 默认模型 | `qwen3:4b` |

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
    defaultModel: "qwen3:4b"
    models:
      - qwen3:4b
      - deepseek-r1:8b
      - llama3.1:8b
      - phi4:mini
```

### 模型分配建议

在 ResumeAI 中，你可以为不同任务指定不同模型：

| 任务 | 推荐模型 | 原因 |
|------|----------|------|
| **简历解析** | `qwen3:4b` | 中文理解强，结构化输出好 |
| **JD 分析** | `deepseek-r1:8b` | 推理能力强，匹配分析准确 |
| **简历生成** | `qwen3.5:7b` | 写作流畅，质量高 |
| **面试题生成** | `deepseek-r1:8b` | 推理能力强 |
| **快速分类** | `phi4:mini` | 速度极快 |

---

## 测试验证

### 1. 测试 Ollama 运行

```bash
# 运行交互式对话
ollama run qwen3:4b

# 输入测试问题
>>> 你好，请用中文介绍一下你自己
```

### 2. 测试 API 连接

```bash
# 测试 Ollama API 是否正常
curl http://localhost:11434/api/generate -d '{
  "model": "qwen3:4b",
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
   # 从 4B 换到 1.7B
   ollama pull qwen3:1.7b
   ```

2. 使用量化版本（自动选择）：
   ```bash
   # Ollama 默认使用 Q4 量化
   ollama pull qwen3:4b-q4_K_M
   ```

3. 让 CPU 分担部分计算：
   ```bash
   # 设置环境变量，限制 GPU 层数
   export OLLAMA_NUM_GPU=20
   ```

### Q2: 模型下载速度慢？

**解决方案：**

1. 使用镜像站（如果有）
2. 先下载小模型测试：
   ```bash
   ollama pull phi4:mini  # 只需 ~2GB
   ```

### Q3: macOS 上运行慢？

**解决方案：**

1. 确保 Metal 加速已启用（Ollama 自动支持）
2. 关闭其他占用内存的应用
3. 使用更小的模型

### Q4: 如何查看模型运行状态？

```bash
# 查看正在运行的模型
ollama ps

# 查看模型详细信息
ollama show qwen3:4b
```

### Q5: 如何更新模型？

```bash
# 重新 pull 即可更新到最新版
ollama pull qwen3:4b
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

### Q7: 如何选择适合自己的模型？

**快速选择指南：**

| 你的显卡 | 推荐模型 | 一句话评价 |
|----------|----------|------------|
| RTX 3050/4050 (6GB) | `qwen3:1.7b` | 够用，速度快 |
| RTX 3060/4060 (8GB) | `qwen3:4b` | ⭐ 性价比最高 |
| RTX 3070/4070 (12GB) | `qwen3:8b` | 能力强，推荐 |
| RTX 3080/4080 (16GB) | `qwen3:14b` | 高质量输出 |
| RTX 3090/4090 (24GB) | `qwen3:30b-q4` | 接近 GPT-4 |

---

## 🎯 快速检查清单

完成以下步骤后，你的 Ollama 就配置好了：

- [ ] 安装 Ollama 成功（`ollama --version`）
- [ ] 显卡检测完成（`nvidia-smi`）
- [ ] 下载至少一个模型（`ollama pull qwen3:4b`）
- [ ] 测试模型运行（`ollama run qwen3:4b`）
- [ ] ResumeAI 设置中添加 Ollama 提供商
- [ ] 测试连接成功
- [ ] 尝试简历导入功能

---

## 📚 更多资源

- [Ollama 官方文档](https://github.com/ollama/ollama)
- [Ollama 模型库](https://ollama.com/library) - 查看所有可用模型
- [Qwen3 官方文档](https://qwenlm.github.io/)
- [DeepSeek R1 介绍](https://www.deepseek.com/)
- [ResumeAI 使用指南](./README.md)

---

**祝你使用愉快！如有问题，请在 GitHub Issues 中反馈。**