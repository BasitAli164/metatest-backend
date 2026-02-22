# ⚙️ MetaTest-MERN Backend

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Hugging_Face-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black" />
  <br/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/railway-%230B0D0E.svg?style=for-the-badge&logo=railway&logoColor=white" />
</div>

<div align="center">
  <h3>🔧 AI Metamorphic Testing Engine - Backend API</h3>
  <p>Node.js server that powers metamorphic testing with Hugging Face integration</p>
</div>

---

## 📋 **Table of Contents**
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Metamorphic Relations](#-metamorphic-relations)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 **Overview**

MetaTest-MERN Backend is a powerful Node.js/Express API that implements **Metamorphic Testing** for AI models. It solves the "Oracle Problem" by checking relationships between inputs and outputs rather than exact correctness.

The engine:
- Applies 5 different metamorphic transformations
- Communicates with Hugging Face Inference API
- Stores test results in MongoDB for research
- Provides analytics endpoints for the frontend dashboard

---

## ✨ **Features**

### 🔹 **Core Engine**
| Feature | Description |
|---------|-------------|
| 🔄 **Transformation Engine** | 5 metamorphic relations implemented |
| 🤖 **Hugging Face Integration** | Real-time predictions from 120,000+ models |
| 🗄️ **MongoDB Storage** | Persistent storage for research data |
| 📊 **Analytics Aggregation** | Pre-computed statistics for dashboard |

### 🔹 **Metamorphic Relations**
| MR Type | Transformation | Purpose |
|---------|---------------|---------|
| **SYNONYM** | Word replacement with synonyms | Semantic consistency |
| **GENDER_SWAP** | Swap gender-specific terms | Fairness/Bias detection |
| **PUNCTUATION** | Add/remove punctuation | Robustness testing |
| **NEGATION** | Add/remove "not" | Logical consistency |
| **PARAPHRASE** | Rephrase same meaning | Semantic invariance |

### 🔹 **API Features**
- RESTful endpoints
- Query parameters for filtering
- Aggregation pipelines for analytics
- Search functionality for Hugging Face models
- CORS enabled for frontend access

---

## 🛠️ **Tech Stack**

<div align="center">

| **Category** | **Technologies** |
|--------------|------------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB, Mongoose ODM |
| **External API** | Hugging Face Inference API, Axios |
| **Utilities** | Natural (NLP library) |
| **Security** | CORS, Dotenv |
| **Deployment** | Railway.app |

</div>

---

## 📁 **Project Structure**
metatest-backend/
├── 📂 src/
│ ├── 📂 config/
│ │ ├── db.js # Database connection
│ │ └── models.js # Curated model list
│ ├── 📂 controllers/
│ │ └── testController.js # Request handlers
│ ├── 📂 models/
│ │ └── TestResult.js # MongoDB schema
│ ├── 📂 routes/
│ │ └── testRoutes.js # API endpoints
│ ├── 📂 services/
│ │ └── huggingFaceService.js # Hugging Face integration
│ └── 📂 utils/
│ └── metamorphicRules.js # MR implementations
├── .env.example # Environment variables template
├── .gitignore # Git ignore rules
├── package.json # Dependencies
└── server.js # Entry point


---

## 🚀 **Installation**

### Prerequisites
- Node.js **v16.x** or higher
- MongoDB **v5.x** or higher (local or Atlas)
- Hugging Face API key

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/metatest-backend.git
cd metatest-backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Update environment variables
# Edit .env with your credentials

# 5. Start MongoDB (local)
# Make sure MongoDB is running on your system

# 6. Start development server
npm run dev