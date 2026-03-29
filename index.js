const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // عشان يسمح للموبايل يكلم السيرفر

// حط هنا الـ API Key بتاعك من Google AI Studio
const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");

app.post('/ask', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // إعداد الموديل (استخدمنا flash عشان السرعة والخفة)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "حصل مشكلة في الربط مع الذكاء الاصطناعي" });
  }
});

// ده عشان Vercel يعرف يشغل التطبيق
module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
