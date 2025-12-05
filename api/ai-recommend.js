// api/ai-recommend.js
// Stub for AI recommendations – later we plug in OpenAI / Claude.
// For now it just returns a mocked message.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const { age, conditions = [], budget } = req.body || {};

  // Simple rule-based logic for now
  const recs = [];

  if (age >= 40) {
    recs.push("Lipid Profile", "Blood Sugar (Fasting)", "Liver Function Test");
  }
  if (conditions.some((c) => c.toLowerCase().includes("diabetes"))) {
    recs.push("HbA1c Test", "Kidney Function Test");
  }
  if (conditions.some((c) => c.toLowerCase().includes("thyroid"))) {
    recs.push("Thyroid Panel");
  }

  const uniqueRecs = [...new Set(recs)];

  return res.status(200).json({
    engine: "rule-based-stub",
    age,
    conditions,
    budget,
    recommendations: uniqueRecs
  });
}
