import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen flex-col gap-5">
      <h1>Welcome to the Career Cloud</h1>
      <div className="flex items-center gap-5">
        <Link href="/login">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">Login</button>
        </Link>
        <Link href="/signup">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">Signup</button>
        </Link>
      </div>
    </div>
  );
}
