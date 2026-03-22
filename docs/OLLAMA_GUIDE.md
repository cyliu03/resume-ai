# Ollama 本地部署配置指南

> 本指南帮助你从零开始配置 Ollama，让 ResumeAI 使用本地 AI 模型，保护你的隐私安全。
>
> **最后更新：2026-03-22**（实时查询 Ollama 官方库）

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
- 至少 6GB 显存可运行基础模型
- 足够的硬盘空间（每个模型 2-15GB）

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

### macOS

1. 访问 [ollama.com/download](https://ollama.com/download)
2. 点击 **Download for Mac**
3. 打开下载的 `.dmg` 文件，拖到 Applications

### Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

---

## 显卡检测与模型选择

### 步骤 1：检查你的显卡

```bash
# Windows/Linux
nvidia-smi

# macOS (Apple Silicon)
system_profiler SPHardwareDataType | grep "Memory"
```

### 步骤 2：根据显存选择模型（2026-03-22 最新）

> 💡 **重要**：以下推荐基于 2026 年 3 月 22 日 Ollama 官方库最新模型

| 显存大小 | 推荐模型 | 备选模型 | 说明 |
|----------|----------|----------|------|
| **4GB** | `qwen3.5:0.8b` | `phi4-mini`, `gemma3:1b` | 入门级 |
| **6GB** | `qwen3.5:2b` | `llama3.2:3b`, `gemma3:4b` | 轻量级，日常可用 |
| **8GB** | `qwen3.5:4b` ⭐ | `deepseek-r1:8b`, `qwen3:8b` | **性价比最高** |
| **10GB** | `qwen3.5:9b` | `deepseek-r1:8b`, `gemma3:12b` | 能力增强 |
| **12GB** | `qwen3.5:9b` | `deepseek-v3.2`（量化）, `nemotron-cascade-2` | 推荐配置 |
| **16GB** | `qwen3.5:9b` | `deepseek-v3.2`（量化）, `qwen3:14b` | 高质量输出 |
| **24GB** | `qwen3.5:27b` | `deepseek-v3.2`（量化）, `nemotron-cascade-2:30b` | 接近 GPT-4 |
| **48GB+** | `qwen3.5:27b` | `glm-5`, `deepseek-v3.2` | 专业级 |

### 步骤 3：ResumeAI 推荐配置（按显卡型号）

#### 🎮 RTX 3050 / 4050 (6GB VRAM)

```yaml
# 入门级显卡
primary: "qwen3.5:2b"       # 最新 Qwen3.5，中文能力强
fast: "phi4-mini"           # 快速任务
```

#### 🎮 RTX 3060 / 4060 (8GB VRAM) ⭐ 推荐

```yaml
# 主流显卡 - 性价比之选
primary: "qwen3.5:4b"       # ⭐ 最新 Qwen3.5，多模态
reasoning: "deepseek-r1:8b" # DeepSeek R1 推理
fast: "phi4-mini"
```

#### 🎮 RTX 3070 / 4070 (12GB VRAM)

```yaml
# 中端显卡
primary: "qwen3.5:9b"       # 更强的 Qwen3.5
reasoning: "deepseek-r1:8b"
generation: "qwen3.5:9b"
```

#### 🎮 RTX 3080 / 4080 (16GB VRAM)

```yaml
# 高端显卡
primary: "qwen3.5:9b"
reasoning: "deepseek-v3.2"（量化版）
generation: "qwen3.5:27b"（量化版）
vision: "qwen3.5:27b"       # 多模态
```

#### 🎮 RTX 3090 / 4090 (24GB+ VRAM)

```yaml
# 旗舰显卡
primary: "qwen3.5:27b"      # 大模型，高质量
reasoning: "deepseek-v3.2"
vision: "qwen3.5:27b"       # 多模态理解
```

#### 🍎 Apple Silicon (M1/M2/M3/M4)

| 统一内存 | 推荐模型 |
|----------|----------|
| **8GB** | `qwen3.5:2b`, `phi4-mini` |
| **16GB** | `qwen3.5:4b`, `deepseek-r1:8b` |
| **24GB** | `qwen3.5:9b`, `gemma3:12b` |
| **32GB** | `qwen3.5:9b`, `qwen3:14b` |
| **48GB+** | `qwen3.5:27b`, `deepseek-v3.2` |

---

## 下载推荐模型

### 🆕 2026-03-22 最新模型

```bash
# ===== Qwen3.5 系列（最新，推荐）=====
ollama pull qwen3.5:0.8b    # 4GB 显存
ollama pull qwen3.5:2b      # 6GB 显存
ollama pull qwen3.5:4b      # 8GB 显存 ⭐ 推荐
ollama pull qwen3.5:9b      # 12GB 显存
ollama pull qwen3.5:27b     # 24GB+ 显存

# ===== DeepSeek 系列（推理最强）=====
ollama pull deepseek-r1:8b      # 推理能力强
ollama pull deepseek-r1:14b     # 更强推理
ollama pull deepseek-v3.2       # 最新版（需要大显存）

# ===== NVIDIA Nemotron 系列（最新）=====
ollama pull nemotron-cascade-2  # 30B MoE，推理强

# ===== 其他推荐 =====
ollama pull phi4-mini           # 快速模型
ollama pull gemma3:4b           # Google 最新
ollama pull llama3.2:3b         # Meta 轻量版
```

### 按用途选择模型

| 用途 | 推荐模型 | 原因 |
|------|----------|------|
| **简历解析** | `qwen3.5:4b` | 中文最强，结构化输出好 |
| **JD 分析** | `deepseek-r1:8b` | 推理能力强，匹配准确 |
| **简历生成** | `qwen3.5:4b` | 写作流畅，多模态 |
| **面试题生成** | `deepseek-r1:8b` | 推理能力强 |
| **快速分类** | `phi4-mini` | 速度极快 |
| **PDF/图片 OCR** | `qwen3.5:27b` | 多模态，支持视觉 |

### 查看已下载模型

```bash
ollama list
```

### 删除不需要的模型

```bash
ollama rm 模型名称
```

---

## 配置 ResumeAI 连接 Ollama

### 方法：通过设置页面

1. 打开 ResumeAI → **设置**
2. 点击 **添加 AI 提供商**
3. 选择 **Ollama（本地）**
4. 填写配置：

| 字段 | 值 |
|------|-----|
| 名称 | Ollama 本地 |
| API 地址 | `http://localhost:11434` |
| 默认模型 | `qwen3.5:4b` |

5. 点击 **测试连接** → **保存**

---

## 测试验证

### 测试模型运行

```bash
ollama run qwen3.5:4b
>>> 你好，请用中文介绍一下你自己
```

### 测试 API 连接

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "qwen3.5:4b",
  "prompt": "你好"
}'
```

---

## 常见问题

### Q1: 显存不足怎么办？

1. 使用更小的模型：
   ```bash
   ollama pull qwen3.5:2b  # 从 4B 换到 2B
   ```

2. 让 CPU 分担计算（自动处理，会变慢）

### Q2: 如何选择适合自己的模型？

| 你的显卡 | 推荐模型 | 一句话评价 |
|----------|----------|------------|
| RTX 3050/4050 (6GB) | `qwen3.5:2b` | 够用 |
| RTX 3060/4060 (8GB) | `qwen3.5:4b` | ⭐ 性价比最高 |
| RTX 3070/4070 (12GB) | `qwen3.5:9b` | 推荐 |
| RTX 3080/4080 (16GB) | `qwen3.5:9b` | 高质量 |
| RTX 3090/4090 (24GB) | `qwen3.5:27b` | 接近 GPT-4 |

### Q3: ResumeAI 找不到 Ollama？

1. ✅ 确认 Ollama 正在运行：`ollama list`
2. ✅ 确认端口正确：`http://localhost:11434`
3. ✅ 检查防火墙设置

---

## 📚 更多资源

- [Ollama 官方模型库](https://ollama.com/library?sort=newest) - 查看最新模型
- [Qwen3.5 官方介绍](https://ollama.com/library/qwen3.5)
- [DeepSeek 官网](https://www.deepseek.com/)

---

**祝你使用愉快！如有问题，请在 GitHub Issues 中反馈。**