"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Loader2, Send, Youtube } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function VideoQA() {
  const [videoUrl, setVideoUrl] = useState("")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [videoId, setVideoId] = useState("")
  const [docId, setDocId] = useState("")
  const [videoTitle, setVideoTitle] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isAnswering, setIsAnswering] = useState(false)
  const [isVideoProcessed, setIsVideoProcessed] = useState(false)
  const [error, setError] = useState("")

  const handleProcessVideo = async () => {
    if (!videoUrl.trim()) {
      setError("Please enter a YouTube URL")
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      const response = await fetch(`${API_URL}/process/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: videoUrl }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${await response.text()}`)
      }

      const data = await response.json()
      setTimeout(()=> {
        setDocId(data.doc_id)
        setVideoTitle(data.title)
        setIsVideoProcessed(true)
      },2000);
    } catch (error: any) {
      console.error('Error processing video:', error)
      setError(`Failed to process video: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      setError("Please enter a question")
      return
    }

    setIsAnswering(true)
    setError("")

    try {
      const response = await fetch(`${API_URL}/ask/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: question,
          doc_id: docId 
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${await response.text()}`)
      }

      const data = await response.json()
      // Remove newline characters from the answer
      setAnswer(data.answer.replace(/\n/g, ' '))
    } catch (error : any) {
      console.error('Error getting answer:', error)
      setError(`Failed to get answer: ${error.message}`)
    } finally {
      setIsAnswering(false)
    }
  }

  return (
    <div className="grid gap-8">
      {error && (
        <Alert variant="destructive" className="bg-red-900 border-red-800 text-white">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-zinc-800 border-zinc-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="Enter YouTube video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1 bg-zinc-900 border-zinc-700 text-white"
            />
            <Button
              onClick={handleProcessVideo}
              disabled={isProcessing || !videoUrl}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <Youtube className="mr-2 h-4 w-4" />
                  Process Video
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isVideoProcessed && (
        <div className="grid gap-6">
          {videoTitle && (
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-emerald-500">Video Processed Successfully!</h2>
                <p className="text-zinc-300 mt-2">Video Title: {videoTitle}</p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-zinc-400">Ask a question about this video</h2>
              <div className="flex flex-col gap-4">
                <Textarea
                  placeholder="What would you like to know about this video?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[100px] bg-zinc-900 border-zinc-700 text-white"
                />
                <Button
                  onClick={handleAskQuestion}
                  disabled={isAnswering || !question}
                  className="self-end bg-purple-600 hover:bg-purple-700"
                >
                  {isAnswering ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Answer
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Ask Question
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {answer && (
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Answer</h2>
                <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
                  <p className="text-zinc-300">{answer}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}