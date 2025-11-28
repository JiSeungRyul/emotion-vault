import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, BookOpen, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Emotion Vault
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            감정 캡슐 저장소
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            당신의 감정을 텍스트가 아닌 캡슐로 저장하세요. 
            강도, 색상, 타입으로 감정을 기록하고 나중에 다시 회상할 수 있습니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-2 bg-blue-100 rounded-lg w-fit mb-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>감정을 캡슐로 저장</CardTitle>
              <CardDescription>
                강도, 색상, 타입을 선택하여 당신의 감정을 기록하세요
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-2 bg-purple-100 rounded-lg w-fit mb-2">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>타임라인으로 회상</CardTitle>
              <CardDescription>
                저장된 감정 캡슐을 타임라인으로 둘러보고 회상하세요
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/record">
            <Button size="lg" className="w-full sm:w-auto">
              감정 기록하기
            </Button>
          </Link>
          <Link href="/timeline">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              타임라인 보기
            </Button>
          </Link>
        </div>

        <div className="mt-16 p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">감정 타입</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "의지/열정", color: "#FF5A5A" },
              { label: "슬픔/상실", color: "#6B7FD7" },
              { label: "순수한 즐거움", color: "#FFD93D" },
              { label: "회복", color: "#6BCB77" },
              { label: "두려움", color: "#9B6FB1" },
              { label: "외로움", color: "#4D5B7C" },
              { label: "영감", color: "#FF9999" },
              { label: "기타", color: "#A8A8A8" },
            ].map((emotion) => (
              <div
                key={emotion.label}
                className="flex items-center gap-2 p-2 rounded-lg border"
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: emotion.color }}
                />
                <span className="text-sm">{emotion.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
