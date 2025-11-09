"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Activity, Hash, RefreshCw } from "lucide-react"

interface BlockchainStats {
  totalBlocks: number
  isValid: boolean
  latestBlock: {
    index: number
    hash: string
    timestamp: number
  }
}

export default function BlockchainStatus() {
  const [stats, setStats] = useState<BlockchainStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/blockchain/stats")
      const data = await response.json()

      if (data.success) {
        setStats(data.stats)
      } else {
        setError("Failed to fetch blockchain stats")
      }
    } catch (error) {
      setError("Network error")
      console.error("[v0] Blockchain stats fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading && !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Blockchain Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Blockchain Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchStats} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Blockchain Status
            </CardTitle>
            <CardDescription>Real-time blockchain network status</CardDescription>
          </div>
          <Button onClick={fetchStats} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{stats?.totalBlocks || 0}</p>
            <p className="text-sm text-gray-600">Total Blocks</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats?.isValid ? "Valid" : "Invalid"}</p>
            <p className="text-sm text-gray-600">Chain Status</p>
          </div>
        </div>

        {stats?.latestBlock && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Latest Block
            </h4>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Block #:</span>
                <span className="font-mono">{stats.latestBlock.index}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Hash:</span>
                <span className="font-mono text-xs">{stats.latestBlock.hash.substring(0, 16)}...</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Timestamp:</span>
                <span>{new Date(stats.latestBlock.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center pt-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Activity className="w-3 h-3 mr-1" />
            Network Active
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
