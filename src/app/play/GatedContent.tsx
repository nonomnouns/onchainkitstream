'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { PlayCircle, Pause, Volume2, VolumeX, Maximize, Minimize, ChevronDown, ChevronUp } from 'lucide-react'
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { useActiveAccount } from "thirdweb/react"
import { ConnectButton } from "thirdweb/react"
import { client } from "@/app/consts/client"
import { Identity, Avatar, Badge, Name, Address } from '@coinbase/onchainkit/identity'
import { base } from 'viem/chains'

type Comment = {
  id: string
  content: string
  userAddress: string
  createdAt: Date
  episodeId: number
}

const fetchComments = async (episodeId: number): Promise<Comment[]> => {
  try {
    const response = await fetch(`/api/comments?episodeId=${episodeId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

const postComment = async (episodeId: number, content: string): Promise<Comment | null> => {
  try {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ episodeId, content }),
    });
    if (!response.ok) {
      throw new Error('Failed to post comment');
    }
    return response.json();
  } catch (error) {
    console.error('Error posting comment:', error);
    return null;
  }
};

const isValidAddress = (address: string): address is `0x${string}` => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const GatedContent = () => {
  const [currentEpisode, setCurrentEpisode] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showControls, setShowControls] = useState(false)
  const [showEpisodeList, setShowEpisodeList] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const account = useActiveAccount()

  const episodes = [
    { 
      id: 1, 
      title: "part one: The Unwise Friend of Knowledge", 
      description: "soon",
      duration: "58m", 
      src: "https://wlupdutfisf3nqyc.public.blob.vercel-storage.com/Teaser%20Gikos%20Telescope%20(Eng-Sub)%20(1)-bDI8rMK7B5s3O5A9tMMZCUHEeSDMbs.mp4" 
    },
    { 
      id: 2, 
      title: "part two: Threat to Utopia", 
      description: "Learn about the strategic importance of piece exchanges in chess.",
      duration: "55m", 
      src: "https://wlupdutfisf3nqyc.public.blob.vercel-storage.com/Teaser%20Gikos%20Telescope%20(Eng-Sub)%20(1)-bDI8rMK7B5s3O5A9tMMZCUHEeSDMbs.mp4" 
    },
    { 
      id: 3, 
      title: "part three: Everything Returns to Nature", 
      description: "Discover the pros and cons of doubled pawns and how to use them effectively.",
      duration: "59m", 
      src: "https://wlupdutfisf3nqyc.public.blob.vercel-storage.com/Teaser%20Gikos%20Telescope%20(Eng-Sub)%20(1)-bDI8rMK7B5s3O5A9tMMZCUHEeSDMbs.mp4" 
    },
  ]

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100)
      setCurrentTime(video.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    video.addEventListener('timeupdate', updateProgress)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      video.removeEventListener('timeupdate', updateProgress)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [])

  useEffect(() => {
    const loadComments = async () => {
      const fetchedComments = await fetchComments(currentEpisode + 1)
      setComments(fetchedComments)
    }
    loadComments()
  }, [currentEpisode])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0]
    setVolume(volumeValue)
    if (videoRef.current) {
      videoRef.current.volume = volumeValue
      setIsMuted(volumeValue === 0)
    }
  }

  const handleEpisodeSelect = (episodeId: number) => {
    setCurrentEpisode(episodeId - 1)
    setIsPlaying(true)
    setProgress(0)
    if (videoRef.current) {
      videoRef.current.src = episodes[episodeId - 1].src
      videoRef.current.currentTime = 0
      videoRef.current.play()
    }
  }

  const handleProgressChange = (newProgress: number[]) => {
    const newValue = newProgress[0]
    setProgress(newValue)
    if (videoRef.current) {
      const newTime = (newValue / 100) * videoRef.current.duration
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!account || !newComment.trim()) return

    const postedComment = await postComment(currentEpisode + 1, newComment)
    if (postedComment) {
      setComments(prevComments => [postedComment, ...prevComments])
      setNewComment('')
    } else {
      setError('Failed to post comment. Please try again.')
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Media Player and Episode Info */}
          <div className="lg:col-span-2">
            <div 
              ref={containerRef} 
              className="aspect-video bg-black rounded-lg overflow-hidden relative"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                poster="/placeholder.svg?height=720&width=1280&text=Episode+Thumbnail"
                src={episodes[currentEpisode].src}
                onClick={handlePlayPause}
              >
                Your browser does not support the video tag.
              </video>
              {showControls && (
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Progress value={progress} className="mb-2" />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-white hover:text-[#4ABAFF]"
                          onClick={handlePlayPause}
                        >
                          {isPlaying ? <Pause className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-white hover:text-[#4ABAFF]"
                          onClick={handleMute}
                        >
                          {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                        </Button>
                        <Slider
                          value={[volume]}
                          max={1}
                          step={0.01}
                          className="w-24"
                          onValueChange={handleVolumeChange}
                        />
                        <span className="text-sm">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:text-[#4ABAFF]"
                        onClick={handleFullscreen}
                      >
                        {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <h1 className="text-2xl font-bold">{episodes[currentEpisode].title}</h1>
              <p className="text-gray-400 mt-2">{episodes[currentEpisode].description}</p>
            </div>

            {/* Comments Section (Desktop) */}
            <div className="mt-8 hidden lg:block">
              <h2 className="text-xl font-bold mb-4">Comments</h2>
              {account ? (
                <form onSubmit={handleCommentSubmit} className="mb-4">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="mb-2 bg-[#333333] text-white placeholder-gray-400 border-none"
                  />
                  <Button type="submit" className="w-full bg-[#4ABAFF] text-white hover:bg-[#3399FF]">
                    Post Comment
                  </Button>
                </form>
              ) : (
                <div className="mb-4">
                  <p className="mb-2">Please log in to comment.</p>
                  <ConnectButton client={client} />
                </div>
              )}
              {error && (
                <div className="bg-red-500 text-white p-2 rounded-md mb-4">
                  {error}
                </div>
              )}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {comments.map((comment: Comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div>
                      <div className="items-center">
                        {isValidAddress(comment.userAddress) ? (
                          <Identity
                            address={comment.userAddress}
                            className="flex items-center space-x-2"
                            schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9">
                            <Avatar className="w-10 h-10 rounded-full"/>
                            <Address/>
                            <Name className="font-semibold text-[#4ABAFF]"/>
                          </Identity>
                        ) : (
                          <span className="font-semibold text-[#4ABAFF]">
                            {comment.userAddress.slice(0, 6)}...{comment.userAddress.slice(-4)}
                          </span>
                        )}
                          <p className="text-sm text-gray-300 ml">{comment.content}</p>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Episode List */}
          <div className="space-y-4">
            <Card className="bg-[#181818] border-none">
              <CardContent className="p-4">
                <button 
                  className="text-xl font-bold text-white mb-4 flex items-center justify-between w-full"
                  onClick={() => setShowEpisodeList(!showEpisodeList)}
                >
                  Episodes
                  {showEpisodeList ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
                {showEpisodeList && (
                  <div className="space-y-2">
                    {episodes.map((episode, index) => (
                      <button 
                        key={episode.id}
                        className={`w-full text-left p-2  rounded-md transition-colors ${
                          currentEpisode === index ? 'bg-[#333333]' : 'hover:bg-[#333333]'
                        }`}
                        onClick={() => handleEpisodeSelect(index + 1)}
                      >
                        <div className="flex items-center">
                          <div className="w-16 h-9 bg-gray-700 rounded mr-2 flex-shrink-0"></div>
                          <div>
                            <h3 className="text-sm font-semibold text-white">{episode.title}</h3>
                            <p className="text-xs text-gray-400">{episode.duration}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comments Section (Mobile) */}
        <div className="mt-8 lg:hidden">
          <h2 className="text-xl font-bold mb-4">Comments</h2>
          {account ? (
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="mb-2 bg-[#333333] text-white placeholder-gray-400 border-none"
              />
              <Button type="submit" className="w-full bg-[#4ABAFF] text-white hover:bg-[#3399FF]">
                Post Comment
              </Button>
            </form>
          ) : (
            <div className="mb-4">
              <p className="mb-2">Please log in to comment.</p>
              <ConnectButton client={client} />
            </div>
          )}
          {error && (
            <div className="bg-red-500 text-white p-2 rounded-md mb-4">
              {error}
            </div>
          )}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {comments.map((comment: Comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div>
                  <div className="flex items-center space-x-5">
                    {isValidAddress(comment.userAddress) ? (
                      <Identity
                        address={comment.userAddress}
                        className="font-semibold text-[#4ABAFF]"
                        schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                      >
                        <Name/>
                        <Badge />
                      </Identity>
                    ) : (
                      <span className="font-semibold text-[#4ABAFF]">
                        {comment.userAddress.slice(0, 6)}...{comment.userAddress.slice(-4)}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}