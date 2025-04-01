import MemoEditor from "@/components/MemoEditor";
import MemoList from "@/components/MemoList";
import { MemoSearch } from "@/components/MemoSearch";

export default function Home() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-center">Simple Memo</h1>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <MemoEditor />
      </div>
      <div className="space-y-6">
        <MemoSearch />
        <MemoList />
      </div>
    </div>
  );
}
