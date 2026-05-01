"use client"

import { Suspense } from "react"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, ExternalLink } from "lucide-react"
import Link from "next/link"
import { NewsHeader } from "@/components/news-header"
import { NewsFooter } from "@/components/news-footer"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { searchNewsArticles } from "@/lib/news-api"

function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  // URLのクエリパラメータが変わった時に state を更新
  useEffect(() => {
    const q = searchParams.get("q") || ""
    setQuery(q)
  }, [searchParams])

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([])
        return
      }
      setLoading(true)
      try {
        const fetchedResults = await searchNewsArticles(query)
        setResults(fetchedResults)
      } catch (error) {
        console.error("検索に失敗しました:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  const handleSearch = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newQuery = formData.get("q")
    router.push(`/search?q=${encodeURIComponent(newQuery)}`)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            ニュース検索
          </CardTitle>
          <CardDescription>キーワードでニュース記事を検索します。</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              name="q"
              placeholder="キーワードを入力..."
              defaultValue={query}
              key={query} // queryが変わった時に再描画して入力を同期
              className="flex-1"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              検索
            </button>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">検索結果 ({results.length}件)</h2>

      <div className="grid gap-4">
        {loading ? (
          <p className="text-center text-gray-500">検索中...</p>
        ) : results.length > 0 ? (
          results.map((article, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Link href={`/archive/${article.slug}/`} className="group flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{article.ymd}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1" />
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">
            {query ? `「${query}」に一致する記事は見つかりませんでした。` : "検索キーワードを入力してください。"}
          </p>
        )}
      </div>
    </main>
  )
}

export default function SearchPageClient() {
  return (
    <div className="min-h-screen bg-background">
      <NewsHeader />
      <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center">読み込み中...</div>}>
        <SearchResults />
      </Suspense>
      <NewsFooter />
    </div>
  )
}
