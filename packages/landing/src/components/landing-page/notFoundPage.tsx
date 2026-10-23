import { Link } from "@tanstack/react-router";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-white text-black">
      <h1 className="text-5xl font-bold">404</h1>
      <Link to="/" className="text-blue-500 hover:underline">
        Home
      </Link>
    </div>
  );
}
