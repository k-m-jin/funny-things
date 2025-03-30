import MemoEditor from "@/components/MemoEditor";
import MemoList from "@/components/MemoList";
import MemoFilter from "@/components/MemoFilter";

export default function Home() {
  return (
    <main className="container mx-auto max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">Simple Memo</h1>
      <MemoEditor />
      <div className="mt-8">
        <MemoFilter />
        <MemoList />
      </div>
    </main>
  );
}
