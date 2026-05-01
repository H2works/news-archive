import { Calendar } from "lucide-react"
import { getTodaysNewsData, getArchiveDates } from "@/lib/news-api"
import { getNewsData, getArchiveDates2 } from "@/lib/news-data"
import { NewsHeader } from "@/components/news-header"
import { NewsSummaryCard } from "@/components/news-summary"
import { NewsSources } from "@/components/news-sources"
import { NewsArchive } from "@/components/news-archive"
import { NewsFooter } from "@/components/news-footer"

// この関数により、ビルド時に静的にページが生成されます
export default async function NewsArchivePage() {
  let newsData = null
  let archiveDates = []
  let isFallback = false

  try {
    // APIからデータを取得
    newsData = await getTodaysNewsData()
    archiveDates = await getArchiveDates()

    // APIからデータが取得できない場合はフォールバックデータを使用
    if (!newsData) {
      console.warn("APIからデータが取得できなかったため、フォールバックデータを使用します。")
      newsData = await getNewsData()
      isFallback = true
    }
  } catch (error) {
    console.error("データ取得中にエラーが発生しました:", error)
    newsData = await getNewsData()
    isFallback = true
  }

  const { sources, summary, date } = newsData

  return (
    <div className="min-h-screen bg-background">
      <NewsHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Date Header */}
        <div className="flex items-center gap-2 mb-8">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">{date}</h2>
          {isFallback && (
            <span className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded">
              フォールバックデータを表示中
            </span>
          )}
        </div>

        {/* Today's Summary */}
        <NewsSummaryCard summary={summary} />

        {/* News Sources */}
        <NewsSources sources={sources} />

        {/* Archive Section */}
        <NewsArchive archiveDates={archiveDates.length > 0 ? archiveDates : await getArchiveDates2()} />
      </main>

      <NewsFooter />
    </div>
  )
}

// ISR設定（1時間ごとに再生成）
export const revalidate = 3600
