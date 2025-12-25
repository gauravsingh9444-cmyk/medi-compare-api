// api/diabetes.js
// Vercel Serverless Function
// Simple rule-based diabetes risk prediction (demo-safe)

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  const {
    age,
    bmi,
    fastingSugar,
    postMealSugar,
    familyHistory,
    physicalActivity
  } = req.body;

  if (
    age === undefined ||
    bmi === undefined ||
    fastingSugar === undefined ||
    postMealSugar === undefined
  ) {
    return res.status(400).json({
      error: "Missing required health parameters"
    });
  }

  let riskScore = 0;

  // Age factor
  if (age >= 45) riskScore += 2;
  else if (age >= 30) riskScore += 1;

  // BMI factor
  if (bmi >= 30) riskScore += 3;
  else if (bmi >= 25) riskScore += 2;

  // Blood sugar levels
  if (fastingSugar >= 126) riskScore += 4;
  else if (fastingSugar >= 100) riskScore += 2;

  if (postMealSugar >= 200) riskScore += 4;
  else if (postMealSugar >= 140) riskScore += 2;

  // Family history
  if (familyHistory) riskScore += 2;

  // Lifestyle
  if (physicalActivity === "low") riskScore += 2;
  else if (physicalActivity === "moderate") riskScore += 1;

  // Risk classification
  let riskLevel = "Low";
  if (riskScore >= 10) riskLevel = "High";
  else if (riskScore >= 6) riskLevel = "Moderate";

  res.status(200).json({
    riskLevel,
    riskScore,
    message: "This is an AI-assisted risk estimation, not a medical diagnosis.",
    recommendations: [
      "Maintain a healthy diet",
      "Exercise at least 30 minutes daily",
      "Monitor blood sugar regularly",
      "Consult a doctor for clinical confirmation"
    ]
  });
}
