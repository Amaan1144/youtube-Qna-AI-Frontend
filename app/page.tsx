import { VideoQA } from "@/components/video-qa"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          YouTube-QnA AI Assistant
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Extract insights from any YouTube video. Enter a URL, ask questions, and get AI-powered answers based on the
            video content.
          </p>
        </header>

        <VideoQA />
      </div>
    </main>
  )
}
