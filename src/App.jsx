import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Calendar,
  TrendingDown,
  Star,
  Hospital,
  Bell,
  Sparkles,
  Navigation,
  X,
  Check,
  Clock,
  Shield,
  Zap,
  Heart,
  Brain,
  BarChart3,
  Share2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [searchTest, setSearchTest] = useState("");
  const [compareResults, setCompareResults] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔮 AI recommendations state (from /api/ai-recommend)
  const [mlRecommendations, setMlRecommendations] = useState([]);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState("");

  const popularTests = [
    "Complete Blood Count (CBC)",
    "Lipid Profile",
    "Thyroid Panel",
    "Blood Sugar (Fasting)",
    "Liver Function Test",
    "Kidney Function Test",
    "Vitamin D Test",
    "HbA1c",
    "X-Ray",
    "ECG",
    "MRI Scan",
    "CT Scan",
  ];

  const mockHospitals = [
    {
      id: "h1",
      name: "Green Valley Hospital",
      location: "North District, Surat",
      latitude: 21.1902,
      longitude: 72.8511,
      rating: 4.8,
      reviews: 1245,
      tests: {
        "Complete Blood Count (CBC)": 425,
        "Lipid Profile": 650,
        "Thyroid Panel": 850,
      },
      distance: 2.3,
      turnaround: "24 hours",
      inNetwork: true,
      accreditation: ["NABH", "NABL"],
      specialties: ["Pathology", "Radiology"],
    },
    {
      id: "h2",
      name: "City Medical Center",
      location: "Downtown, Surat",
      latitude: 21.1502,
      longitude: 72.8211,
      rating: 4.5,
      reviews: 987,
      tests: {
        "Complete Blood Count (CBC)": 550,
        "Lipid Profile": 750,
        "Thyroid Panel": 950,
      },
      distance: 5.1,
      turnaround: "48 hours",
      inNetwork: true,
      accreditation: ["NABH"],
      specialties: ["Pathology", "Cardiology"],
    },
    {
      id: "h3",
      name: "Sunrise Healthcare",
      location: "East Side, Surat",
      latitude: 21.1402,
      longitude: 72.8711,
      rating: 4.2,
      reviews: 756,
      tests: {
        "Complete Blood Count (CBC)": 650,
        "Lipid Profile": 850,
        "Thyroid Panel": 1050,
      },
      distance: 3.7,
      turnaround: "24 hours",
      inNetwork: false,
      accreditation: ["NABL"],
      specialties: ["Pathology"],
    },
  ];

  const priceTrendData = [
    { month: "Jul", price: 450 },
    { month: "Aug", price: 445 },
    { month: "Sep", price: 440 },
    { month: "Oct", price: 435 },
    { month: "Nov", price: 430 },
    { month: "Dec", price: 425 },
  ];

  const savingsData = [
    { category: "Insurance", amount: 1850, color: "#3b82f6" },
    { category: "Comparison", amount: 1200, color: "#10b981" },
    { category: "Referrals", amount: 400, color: "#f59e0b" },
  ];

  const paymentPlans = [
    { months: 3, emi: 150, total: 450, interest: 0 },
    { months: 6, emi: 78, total: 468, interest: 18, recommended: true },
    { months: 12, emi: 42, total: 504, interest: 54 },
  ];

  const calculateScore = (hospital, price) => {
    const maxPrice = 1000;
    const maxDistance = 10;
    const priceScore = ((maxPrice - price) / maxPrice) * 50;
    const distanceScore = ((maxDistance - hospital.distance) / maxDistance) * 30;
    const ratingScore = (hospital.rating / 5) * 20;
    return Math.round(priceScore + distanceScore + ratingScore);
  };

  // 🔍 Search: use live API /api/hospitals
  const handleSearch = async () => {
    if (!searchTest) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/hospitals?test=${encodeURIComponent(searchTest)}`
      );

      const data = await response.json();

      // If API returns hospitals, use them
      if (data && data.hospitals && Array.isArray(data.hospitals)) {
        const results = data.hospitals.map((h) => {
          const base =
            h.price ??
            h.tests?.[searchTest] ??
            h.tests?.[searchTest.toLowerCase()] ??
            h.tests?.[Object.keys(h.tests || {})[0]] ??
            500;

          const outOfPocket = Math.round(base * 0.3);
          return {
            ...h,
            basePrice: base,
            outOfPocket,
            savings: base - outOfPocket,
            overallScore: calculateScore(
              {
                ...h,
                distance: h.distance_km ?? h.distance ?? 5,
              },
              base
            ),
          };
        });

        results.sort((a, b) => b.overallScore - a.overallScore);
        setCompareResults(results);
      } else {
        // Fallback to mockHospitals if API shape is unexpected
        const results = mockHospitals
          .filter((h) => h.tests[searchTest])
          .map((h) => {
            const base = h.tests[searchTest];
            const outOfPocket = Math.round(base * 0.3);
            return {
              ...h,
              basePrice: base,
              outOfPocket,
              savings: base - outOfPocket,
              overallScore: calculateScore(h, base),
            };
          })
          .sort((a, b) => b.overallScore - a.overallScore);

        setCompareResults(results);
      }
    } catch (error) {
      console.error("Error fetching API:", error);
    }
    setLoading(false);
  };

  const handleBookNow = (hospital) => {
    setSelectedHospital(hospital);
    setShowBookingModal(true);
  };

  // 🔮 Load AI recommendations from /api/ai-recommend
  const loadAiRecommendations = async () => {
    setMlLoading(true);
    setMlError("");
    try {
      const res = await fetch("/api/ai-recommend");
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Could not load AI recommendations");
      }

      setMlRecommendations(data.recommendations || []);
    } catch (err) {
      console.error("AI recommendations error:", err);
      setMlError(err.message || "Something went wrong while loading AI suggestions.");
    } finally {
      setMlLoading(false);
    }
  };

  // Auto-load AI suggestions when user opens Analytics tab
  useEffect(() => {
    if (
      activeTab === "analytics" &&
      mlRecommendations.length === 0 &&
      !mlLoading
    ) {
      loadAiRecommendations();
    }
  }, [activeTab, mlRecommendations, mlLoading]);

  // ⭐ HERO SECTION WITH AI CARDS (CLICKABLE)
  const HeroSection = () => {
    // Use real AI recs if available, otherwise show nice defaults
    const heroCards =
      mlRecommendations.length > 0
        ? mlRecommendations.slice(0, 3).map((rec, idx) => ({
            id: `ai-${idx}`,
            title: rec.test,
            subtitle: rec.reason || "Smart pick based on your profile",
            badge: rec.score != null ? `${rec.score}% match` : "AI suggested",
            price: `From ₹${rec.price}`,
          }))
        : [
            {
              id: "cbc",
              title: "CBC • Best Overall Value",
              subtitle: "Green Valley Hospital • 2.3 km away",
              badge: "Save up to 68%",
              price: "From ₹425 → ₹140 with insurance",
            },
            {
              id: "lipid",
              title: "Lipid Profile • Heart Health",
              subtitle: "Top 3 cheapest labs near you",
              badge: "AI pick",
              price: "From ₹650 • 92% match",
            },
            {
              id: "thyroid",
              title: "Thyroid Panel • Trending",
              subtitle: "Frequently booked by users like you",
              badge: "Smart choice",
              price: "From ₹850 • Stable prices this month",
            },
          ];

    return (
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">
                AI-Powered Healthcare Savings
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Save up to <span className="text-yellow-300">70%</span> on Medical
              Tests
            </h1>
            <p className="text-xl text-blue-100">
              Compare prices across hospitals, get AI recommendations, and book
              appointments instantly.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setActiveTab("compare")}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Comparing
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text.white rounded-xl font-semibold hover:bg-white/20 transition border-2 border-white/30">
                Watch Demo
              </button>
            </div>
            <div className="flex items-center space-x-8 pt-4">
              <StatBubble value="$3.2M+" label="Total Saved" />
              <StatBubble value="25K+" label="Happy Users" />
              <StatBubble value="150+" label="Hospitals" />
            </div>
          </div>

          {/* RIGHT SIDE – AI INSIGHTS PANEL */}
          <div className="relative hidden lg:block">
            <div className="absolute -top-4 -right-4 w-6 h-6 rounded-full bg-emerald-400/70 blur-xl opacity-60 animate-pulse" />

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-blue-100 tracking-wide uppercase">
                    Live AI Insights
                  </p>
                  <p className="text-sm text-blue-50">
                    Optimized for your city & nearby hospitals
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-300" />
                </div>
              </div>

              <div className="space-y-3 mt-3">
                {heroCards.map((card, idx) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => {
                      // extract clean test name e.g. "CBC • Best Overall Value" -> "CBC"
                      const testName = card.title.split("•")[0].trim();
                      setSearchTest(testName);
                      setActiveTab("compare");
                      setTimeout(() => {
                        handleSearch();
                      }, 150);
                    }}
                    className={`group relative w-full text-left overflow-hidden rounded-xl bg-white/95 backdrop-blur shadow-lg transition transform duration-300 hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      idx === 2 ? "bg-gradient-to-r from-indigo-50 to-purple-50" : ""
                    }`}
                  >
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500" />
                    <div className="flex items-center px-4 py-3 pl-5">
                      <div className="mr-3 flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md group-hover:scale-105 transition-transform">
                        {idx === 0 && <TrendingDown className="w-5 h-5" />}
                        {idx === 1 && <Brain className="w-5 h-5" />}
                        {idx === 2 && <Sparkles className="w-5 h-5" />}
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {card.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {card.subtitle}
                        </p>
                        <p className="text-xs font-medium text-emerald-600 mt-1">
                          {card.price}
                        </p>
                      </div>

                      <div className="ml-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {card.badge}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <p className="mt-4 text-[11px] text-blue-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                MediCompare AI continuously scans prices, distance and ratings to
                surface the smartest options for you.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const StatBubble = ({ value, label }) => (
    <div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-blue-200 text-sm">{label}</p>
    </div>
  );

  const StatsBar = () => (
    <div className="bg-white shadow-md py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <HomeStat
            icon={<Shield className="w-8 h-8 text-blue-600" />}
            value="100%"
            label="Verified Hospitals"
          />
          <HomeStat
            icon={<Zap className="w-8 h-8 text-yellow-500" />}
            value="24/7"
            label="Support Available"
          />
          <HomeStat
            icon={<Heart className="w-8 h-8 text-red-500" />}
            value="50K+"
            label="Tests Booked"
          />
          <HomeStat
            icon={<TrendingDown className="w-8 h-8 text-green-600" />}
            value="$1,250"
            label="Avg Savings"
          />
        </div>
      </div>
    </div>
  );

  const HomeStat = ({ icon, value, label }) => (
    <div className="text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );

  const CompareSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Search className="w-8 h-8 mr-3 text-blue-600" />
          Find Best Prices
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              What test are you looking for?
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                list="tests"
                value={searchTest}
                onChange={(e) => setSearchTest(e.target.value)}
                placeholder="Type to search tests..."
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <datalist id="tests">
                {popularTests.map((test) => (
                  <option key={test} value={test} />
                ))}
              </datalist>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Max Distance
            </label>
            <select className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-lg">
              <option>5 km</option>
              <option>10 km</option>
              <option>25 km</option>
              <option>50 km</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={!searchTest || loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Compare Prices Now</span>
            </>
          )}
        </button>

        <div className="mt-6">
          <p className="text-sm font-semibold text-gray-600 mb-3">
            Popular Searches:
          </p>
          <div className="flex flex-wrap gap-2">
            {popularTests.slice(0, 6).map((test) => (
              <button
                key={test}
                onClick={() => {
                  setSearchTest(test);
                  setTimeout(handleSearch, 100);
                }}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
              >
                {test}
              </button>
            ))}
          </div>
        </div>
      </div>

      {compareResults && compareResults.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Results for {searchTest}
            </h3>
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
              {compareResults.length} hospitals found
            </span>
          </div>

          <div className="space-y-4">
            {compareResults.map((hospital, idx) => (
              <div
                key={hospital.id}
                className={`border-2 rounded-xl p-6 transition hover:shadow-xl ${
                  idx === 0
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h4 className="text-xl font-bold text-gray-800">
                        {hospital.name}
                      </h4>
                      {idx === 0 && (
                        <span className="px-3 py-1 bg-green-500 text.white text-xs font-bold rounded-full flex items-center">
                          <Check className="w-3 h-3 mr-1" />
                          BEST VALUE
                        </span>
                      )}
                      {hospital.inNetwork && (
                        <span className="px-3 py-1 bg-blue-500 text.white text-xs font-bold rounded-full">
                          IN-NETWORK
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {hospital.location}
                      </span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                        {hospital.rating} ({hospital.reviews} reviews)
                      </span>
                      <span className="flex items-center">
                        <Navigation className="w-4 h-4 mr-1" />
                        {(hospital.distance_km ?? hospital.distance)?.toFixed
                          ? (hospital.distance_km ?? hospital.distance).toFixed(1)
                          : hospital.distance_km ?? hospital.distance ?? 5}{" "}
                        km away
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {hospital.turnaround}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(hospital.accreditation || []).map((acc) => (
                        <span
                          key={acc}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded"
                        >
                          {acc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-center lg:text-right">
                    <div className="mb-2">
                      <p className="text-sm text-gray-500 line-through">
                        ₹{hospital.basePrice}
                      </p>
                      <p className="text-4xl font-bold text-green-600">
                        ₹{hospital.outOfPocket}
                      </p>
                      <p className="text-sm text-green-600 font-semibold">
                        You save ₹{hospital.savings}
                      </p>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">Overall Score</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {hospital.overallScore}/100
                      </p>
                    </div>
                    <button
                      onClick={() => handleBookNow(hospital)}
                      className="w-full lg:w-auto px-6 py-3 bg-blue-600 text.white rounded-xl hover:bg-blue-700 transition font-semibold shadow-lg flex items-center justify-center space-x-2"
                    >
                      <Calendar className="w-5 h-5" />
                      <span>Book Now</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  💰 Maximum savings between cheapest & costliest option
                </p>
                <p className="text-5xl font-bold text-green-600">
                  ₹
                  {compareResults[compareResults.length - 1].outOfPocket -
                    compareResults[0].outOfPocket}
                </p>
              </div>
              <TrendingDown className="w-20 h-20 text-green-500" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-8 text.white">
          <div className="flex items-center space-x-3 mb-6">
            <Brain className="w-8 h-8" />
            <h3 className="text-2xl font-bold">AI Price Prediction</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm opacity-90 mb-1">Current Average Price</p>
              <p className="text-4xl font-bold">₹425</p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Predicted Next Month</p>
              <p className="text-4xl font-bold">₹410</p>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <TrendingDown className="w-6 h-6" />
              <p className="text-sm">
                Price expected to drop 3.5%. Consider booking later to save
                ~₹15.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Price Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={priceTrendData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const AnalyticsSection = ({
    mlRecommendations,
    mlLoading,
    mlError,
    onReload,
  }) => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
          Your Savings Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashCard
            title="Total Saved"
            value="₹3,450"
            subtitle="+12% from last month"
            color="from-blue-500 to-blue-600"
          />
          <DashCard
            title="Tests Compared"
            value="24"
            subtitle="This year"
            color="from-green-500 to-green-600"
          />
          <DashCard
            title="Avg Savings / Test"
            value="₹144"
            subtitle="Per booked test"
            color="from-purple-500 to-purple-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Savings Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={savingsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  dataKey="amount"
                >
                  {savingsData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Monthly Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 🔮 AI Recommendations */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <Sparkles className="w-7 h-7 mr-2 text-yellow-500" />
            AI Recommendations for You
          </h3>
          <button
            onClick={onReload}
            className="px-4 py-2 text-sm font-semibold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
          >
            Refresh
          </button>
        </div>

        {mlError && (
          <p className="text-sm text-red-600 mb-4">
            ⚠ {mlError}
          </p>
        )}

        {mlLoading && (
          <p className="text-sm text-gray-500 mb-4">Loading AI suggestions…</p>
        )}

        {!mlLoading && !mlError && mlRecommendations.length === 0 && (
          <p className="text-sm text-gray-500">
            No AI suggestions yet. Click “Refresh” to fetch recommendations.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mlRecommendations.map((rec, idx) => (
            <div
              key={idx}
              className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-500 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-lg text-gray-800">
                    {rec.test}
                  </h4>
                  {rec.reason && (
                    <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                  )}
                </div>
                {rec.priority && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      rec.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {rec.priority.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Typical price</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{rec.price}
                  </p>
                </div>
                {rec.score != null && (
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Match</p>
                    <p className="text-xl font-bold text-purple-600">
                      {rec.score}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DashCard = ({ title, value, subtitle, color }) => (
    <div
      className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white shadow-lg`}
    >
      <p className="text-sm opacity-90 mb-2">{title}</p>
      <p className="text-4xl font-bold">{value}</p>
      <p className="text-sm opacity-90 mt-2">{subtitle}</p>
    </div>
  );

  const BookingModal = () =>
    showBookingModal &&
    selectedHospital && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Book Appointment
            </h2>
            <button
              onClick={() => setShowBookingModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-bold text-lg text-gray-800">
                {selectedHospital.name}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedHospital.location}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <span className="flex items-center text-yellow-600">
                  <Star className="w-4 h-4 fill-yellow-400 mr-1" />
                  {selectedHospital.rating}
                </span>
                <span className="text-gray-600">
                  {selectedHospital.distance} km away
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>9:00 AM - 10:00 AM</option>
                    <option>10:00 AM - 11:00 AM</option>
                    <option>11:00 AM - 12:00 PM</option>
                    <option>2:00 PM - 3:00 PM</option>
                    <option>3:00 PM - 4:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  placeholder="Any special requirements..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Base Price</span>
                  <span className="line-through">
                    ₹{selectedHospital.basePrice}
                  </span>
                </div>
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Insurance Discount (approx)</span>
                  <span>-₹{selectedHospital.savings}</span>
                </div>
                <div className="border-t-2 border-green-200 pt-2 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">
                    You Pay
                  </span>
                  <span className="text-3xl font-bold text-green-600">
                    ₹{selectedHospital.outOfPocket}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setShowPaymentModal(true);
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text.white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
              >
                Proceed to Payment
              </button>
              <button
                onClick={() => setShowBookingModal(false)}
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  const PaymentModal = () =>
    showPaymentModal && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Payment Options</h2>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
              <p className="text-4xl font-bold text-blue-600">
                ₹{selectedHospital ? selectedHospital.outOfPocket : 425}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-4">
                Choose Payment Method
              </h3>
              <div className="space-y-3">
                {[
                  "Credit/Debit Card",
                  "UPI",
                  "Net Banking",
                  "Wallets (Paytm, PhonePe)",
                  "Pay Later (0% EMI)",
                ].map((method) => (
                  <label
                    key={method}
                    className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 cursor-pointer transition"
                  >
                    <span className="font-medium text-gray-700">{method}</span>
                    <input
                      type="radio"
                      name="payment"
                      className="w-5 h-5 text-blue-600"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-4">
                EMI Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentPlans.map((plan) => (
                  <div
                    key={plan.months}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                      plan.recommended
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    {plan.recommended && (
                      <span className="bg-blue-500 text.white text-xs px-2 py-1 rounded-full mb-2 inline-block">
                        RECOMMENDED
                      </span>
                    )}
                    <p className="text-sm text-gray-600">
                      {plan.months} Months
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      ₹{plan.emi}
                      <span className="text-sm text-gray-500">/mo</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Total: ₹{plan.total}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text.white py-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition shadow-lg flex items-center justify-center space-x-2">
              <Check className="w-5 h-5" />
              <span>Complete Payment</span>
            </button>
          </div>
        </div>
      </div>
    );

  const ShareModal = () =>
    showShareModal && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Share Your Savings!
          </h2>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6 text-center">
            <p className="text-5xl font-bold text-green-600 mb-2">₹3,450</p>
            <p className="text-gray-600">Total savings this year</p>
          </div>

          <div className="space-y-3">
            <button className="w-full bg-blue-600 text.white py-3 rounded-xl hover:bg-blue-700 transition font-semibold flex items-center justify-center space-x-2">
              <Share2 className="w-5 h-5" />
              <span>Share on Facebook</span>
            </button>
            <button className="w-full bg-sky-500 text.white py-3 rounded-xl hover:bg-sky-600 transition font-semibold flex items-center justify-center space-x-2">
              <Share2 className="w-5 h-5" />
              <span>Share on Twitter</span>
            </button>
            <button className="w-full bg-green-500 text.white py-3 rounded-xl hover:bg-green-600 transition font-semibold flex items-center justify-center space-x-2">
              <Share2 className="w-5 h-5" />
              <span>Share on WhatsApp</span>
            </button>
          </div>

          <button
            onClick={() => setShowShareModal(false)}
            className="w-full mt-4 text-gray-600 hover:text-gray-800 py-2 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveTab("home")}
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
              <Hospital className="w-8 h-8 text.white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MediCompare AI
              </h1>
              <p className="text-xs text-gray-500">Healthcare Made Affordable</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setActiveTab("compare")}
              className={`font-medium transition ${
                activeTab === "compare"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Compare
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`font-medium transition ${
                activeTab === "analytics"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Share
            </button>
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-0 right-0 bg-red-500 text.white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text.white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold shadow-lg">
              Sign In
            </button>
          </div>
        </div>
      </header>

      {activeTab === "home" && (
        <>
          <HeroSection />
          <StatsBar />
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Why Choose MediCompare?
              </h2>
              <p className="text-xl text-gray-600">
                Save money, time, and get the best care
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <FeatureCard
                icon={<Brain className="w-8 h-8 text-blue-600" />}
                title="AI-Powered"
                text="Machine learning predicts prices and recommends best options."
              />
              <FeatureCard
                icon={<TrendingDown className="w-8 h-8 text-green-600" />}
                title="Save Up to 70%"
                text="Compare prices and get the best deals on medical tests."
              />
              <FeatureCard
                icon={<Shield className="w-8 h-8 text-purple-600" />}
                title="100% Verified"
                text="All hospitals are verified and accredited."
              />
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-12 text-center text.white">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Start Saving?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join 25,000+ users who are saving on healthcare.
              </p>
              <button
                onClick={() => setActiveTab("compare")}
                className="px-8 py-4 bg.white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Comparing Now
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === "compare" && (
        <div className="max-w-7xl mx-auto px-4 py-8 flex-1">
          <CompareSection />
        </div>
      )}

      {activeTab === "analytics" && (
        <AnalyticsSection
          mlRecommendations={mlRecommendations}
          mlLoading={mlLoading}
          mlError={mlError}
          onReload={loadAiRecommendations}
        />
      )}

      <BookingModal />
      <PaymentModal />
      <ShareModal />

      <footer className="bg-gray-900 text.white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Hospital className="w-8 h-8" />
                <span className="text-xl font-bold">MediCompare AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                Making healthcare affordable and accessible for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text.white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text.white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text.white transition">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text.white transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text.white transition">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text.white transition">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                  <Brain className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 MediCompare AI. All rights reserved. Made with ❤️.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition transform hover:-translate-y-2">
      <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}
