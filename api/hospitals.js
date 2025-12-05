// api/hospitals.js
// Vercel Serverless Function – returns Surat hospitals + test prices

export default function handler(req, res) {
  const { query } = req;
  const testName = query.test?.toLowerCase();

  // --- SAMPLE REALISTIC SURAT DATA (you can expand this later) ---
  const hospitals = [
    {
      id: "sgh",
      name: "Surat General Hospital",
      location: "Majura Gate, Surat",
      latitude: 21.1888,
      longitude: 72.8308,
      rating: 4.4,
      reviews: 1320,
      distance_km: 2.1,
      turnaround: "24 hours",
      inNetwork: true,
      accreditation: ["NABH", "NABL"],
      specialties: ["Pathology", "Radiology", "Cardiology"],
      tests: {
        "complete blood count (cbc)": 420,
        "lipid profile": 780,
        "thyroid panel": 900,
        "blood sugar (fasting)": 160,
        "liver function test": 950
      }
    },
    {
      id: "apollo",
      name: "Apollo Clinic Surat",
      location: "Ghod Dod Road, Surat",
      latitude: 21.1722,
      longitude: 72.8147,
      rating: 4.6,
      reviews: 980,
      distance_km: 3.5,
      turnaround: "24–48 hours",
      inNetwork: true,
      accreditation: ["NABH"],
      specialties: ["Pathology", "Diabetes Care"],
      tests: {
        "complete blood count (cbc)": 550,
        "lipid profile": 890,
        "thyroid panel": 1100,
        "blood sugar (fasting)": 200,
        "vitamin d test": 1250
      }
    },
    {
      id: "sunshine",
      name: "Sunshine Diagnostic Center",
      location: "Adajan, Surat",
      latitude: 21.2049,
      longitude: 72.7925,
      rating: 4.2,
      reviews: 740,
      distance_km: 4.3,
      turnaround: "24 hours",
      inNetwork: false,
      accreditation: ["NABL"],
      specialties: ["Pathology", "Imaging"],
      tests: {
        "complete blood count (cbc)": 380,
        "lipid profile": 720,
        "thyroid panel": 880,
        "blood sugar (fasting)": 150,
        "kidney function test": 900
      }
    },
    {
      id: "unique",
      name: "Unique Hospital & Research Center",
      location: "Varachha, Surat",
      latitude: 21.2285,
      longitude: 72.8403,
      rating: 4.1,
      reviews: 610,
      distance_km: 5.2,
      turnaround: "24–36 hours",
      inNetwork: true,
      accreditation: ["NABH"],
      specialties: ["Multi-speciality", "Pathology"],
      tests: {
        "complete blood count (cbc)": 460,
        "lipid profile": 810,
        "thyroid panel": 930,
        "blood sugar (fasting)": 170,
        "liver function test": 980
      }
    }
  ];

  // If a test name is passed, filter only hospitals that offer it
  let result = hospitals;

  if (testName) {
    result = hospitals
      .filter((h) => Object.keys(h.tests).includes(testName))
      .map((h) => ({
        ...h,
        price: h.tests[testName]
      }));
  }

  res.status(200).json({
    city: "Surat",
    test: testName || null,
    total: result.length,
    hospitals: result
  });
}
