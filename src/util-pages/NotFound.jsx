import { Link } from 'react-router-dom';  // Adjust the path based on where your image is stored

export default function NotFoundPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white text-center">
      <div className="space-y-6 max-w-md w-full p-8 bg-gray-900 rounded-xl shadow-2xl">
        {/* Image */}
        <img src="/logo.png" alt="OYOCAM" className="mx-auto mb-4 w-40 h-40 object-cover rounded-full" />

        {/* Error Message */}
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg mb-6">
          Oops! It seems the page you're looking for is out of reach. Let’s get you back on track.
        </p>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="px-6 py-2 bg-yellow-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
        >
          Back to Home
        </Link>

        <p className="text-sm text-gray-400 pt-2">
          Still stuck? Message us about the website issue: <span className="font-mono text-gray-300">+234 807 376 5008</span>
        </p>
      </div>
    </div>
  );
}