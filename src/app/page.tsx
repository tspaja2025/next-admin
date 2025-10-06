import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <Link href="/admin">Admin</Link>
    </div>
  );
}
