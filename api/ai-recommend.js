export default function handler(req, res) {
  const { age, focus } = req.query;

  // Basic sample recommendations (you can improve this later)
  let recommendations = [
    {
      test: "Complete Blood Count (CBC)",
      priority: "medium",
      price: 350,
      score: 82,
      reason: "General health indicator"
    },
    {
      test: "Lipid Profile",
      priority: "medium",
      price: 450,
      score: 85,
      reason: "Checks cholesterol levels"
    },
    {
      test: "Thyroid Panel",
      priority: "medium",
      price: 800,
      score: 79,
      reason: "Thyroid hormone evaluation"
    }
  ];

  // Add age-based recommendations
  if (age && Number(age) > 40) {
    recommendations.push({
      test: "Liver Function Test",
      priority: "medium",
      price: 900,
      score: 84,
      reason: "Helps detect metabolic & liver-related issues"
    });
  }

  // Add focus-based recommendations
  if (focus && focus.toLowerCase() === "heart") {
    recommendations.unshift({
      test: "Cardiac Risk Panel",
      priority: "high",
      price: 1500,
      score: 97,
      reason: "Strong indicators of cardiac risk"
    });
  }

  return res.status(200).json({
    success: true,
    recommendations
  });
}
