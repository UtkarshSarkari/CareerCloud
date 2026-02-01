import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-2.5rem)] flex-col gap-5 bg-black">
      <div className="text-center flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-white">Welcome to Career Cloud</h1>
        <p className="text-lg text-gray-300">Seamless Job Tracking and Management</p>
      </div>
      <div className="flex items-center gap-5">
        <Link href="/login">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600">Login</button>
        </Link>
        <Link href="/signup">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600">Signup</button>
        </Link>
      </div>
    </div>
  );
}
