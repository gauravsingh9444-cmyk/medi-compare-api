import { useLocation } from "react-router-dom";

export default function BookPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const test = params.get("test");
  const hospital = params.get("hospital");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>

      <p><strong>Test:</strong> {test}</p>
      <p><strong>Hospital:</strong> {hospital}</p>

      <form className="mt-6 flex flex-col gap-4 max-w-md">
        <input type="text" placeholder="Your Name" className="border p-3 rounded" />
        <input type="date" className="border p-3 rounded" />
        <input type="time" className="border p-3 rounded" />

        <button className="bg-blue-600 text-white py-3 rounded-lg">
          Confirm Booking
        </button>
      </form>
    </div>
  );
}
