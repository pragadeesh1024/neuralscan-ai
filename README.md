# 🧠 Brain Tumor Detection

A deep learning web application that classifies brain tumor types from MRI images using a Convolutional Neural Network (CNN).

## 🔗 Live Demo
[brain-tumor-detection-self-eight.vercel.app](https://brain-tumor-detection-self-eight.vercel.app)

## 📌 About
This project uses a CNN model trained on 44 classes of brain MRI scans to detect and classify tumor types. Upload an MRI image and the model predicts whether a tumor is present and identifies the type.

## 🏷️ Tumor Classes
The model can classify 44 types including:
- Glioblastoma, Astrocitoma, Meningioma, Ganglioglioma
- Schwannoma, Ependimoma, Meduloblastoma, Neurocitoma
- Oligodendroglioma, Germinoma, Carcinoma, Papiloma
- Granuloma, Tuberculoma and more
- Normal brain scans (T1, T2)

## 🛠️ Tech Stack
- **Model**: TensorFlow / Keras CNN
- **Frontend**: Gradio
- **Deployment**: Hugging Face Spaces + Vercel
- **Training**: Google Colab

## 📊 Model Architecture
- 3 Convolutional layers with BatchNormalization
- MaxPooling + Dropout for regularization
- Dense layers with Softmax output (44 classes)
- Trained with Adam optimizer

## 🚀 How to Use
1. Open the app
2. Upload a brain MRI image
3. Click **Predict**
4. Get instant result — Tumor Detected or No Tumor Detected

## 📁 Dataset
Brain tumor MRI dataset with 44 classified categories (T1, T1C+, T2 scan types).
