const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_X_MICROCMS_API_KEY || "";

// ----------------- Utility -----------------
function formatDateToSlug(date) {
  return date.toISOString().split("T")[0];
}

function generateDateRange() {
  const startDate = new Date("2025-07-15");
  const endDate = new Date();
  const dates = [];

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(formatDateToSlug(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// API から記事取得
export async function fetchNewsArticleByDate(dateSlug) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/news/${dateSlug}`, {
      headers: {
        "X-MICROCMS-API-KEY": API_KEY,
        "accept": "*/*",
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`記事が見つかりません: ${dateSlug}`);
        return null;
      }
      throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`記事の取得に失敗 (${dateSlug}):`, error);
    return null;
  }
}

// 記事リストを整形
function parseArticleContent(article) {
  const sourceMap = [
    { key: "nhk", name: "NHK NEWS WEB", category: "総合" },
    { key: "nikkei", name: "日本経済新聞", category: "経済" },
    { key: "bloomberg", name: "Bloomberg", category: "経済" },
    { key: "sankei", name: "産経新聞", category: "総合" },
    { key: "yomiuri", name: "読売新聞", category: "総合" },
  ];

  return sourceMap.map(({ key, name, category }) => {
    const entries = article[key] || [];

    const articles = entries.map((entry) => {
      // time の抽出 (date フィールドから)
      let time = "";
      if (entry.date) {
        const d = new Date(entry.date);
        time = d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
      }

      return {
        title: entry.title || "タイトルなし",
        time,
        url: entry.url || "#",
        source: name,
      };
    });

    return { name, category, articles };
  });
}

// 要約を整形
function parseSummaryContent(article) {
  return {
    markdown: article.summary || "本日のニュースまとめはありません。",
  };
}

// 今日のニュース
export async function getTodaysNewsData() {
  const todaySlug = formatDateToSlug(new Date());
  let article = await fetchNewsArticleByDate(todaySlug);

  if (!article) {
    const dates = generateDateRange().reverse();
    for (const date of dates) {
      article = await fetchNewsArticleByDate(date);
      if (article) break;
    }
    if (!article) return null;
  }

  return {
    sources: parseArticleContent(article),
    summary: parseSummaryContent(article),
    date: new Date(article.date || article.id).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }),
  };
}

// 指定日付のニュース
export async function getNewsDataByDate(dateSlug) {
  const article = await fetchNewsArticleByDate(dateSlug);
  if (!article) return null;

  return {
    sources: parseArticleContent(article),
    summary: parseSummaryContent(article),
    date: new Date(article.date || dateSlug).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }),
  };
}

// アーカイブ用日付（直近10件）
export async function getArchiveDates() {
  const dates = generateDateRange().reverse();
  const availableDates = [];

  // API 負荷軽減のため、並列でチェックするか検討が必要ですが、現状は順次
  for (const date of dates.slice(0, 10)) {
    const article = await fetchNewsArticleByDate(date);
    if (article) {
      availableDates.push({
        slug: date, // YYYY-MM-DD
        label: new Date(date).toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
    }
  }

  return availableDates;
}

// すべての日付slug一覧（年月日形式）
export async function getAllAvailableDates() {
  return generateDateRange();
}

// 検索API
export async function searchNewsArticles(keyword = "") {
  try {
    const url = new URL(`${API_BASE_URL}/api/v1/news`);
    if (keyword) {
      url.searchParams.append('q', keyword);
    }
    url.searchParams.append("limit", "100");

    const response = await fetch(url.toString(), {
      headers: {
        "X-MICROCMS-API-KEY": API_KEY,
        "accept": "*/*",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    if (data && Array.isArray(data.contents)) {
      return data.contents.map((item) => ({
        slug: item.id,
        title: item.subject,
        ymd: item.date ? item.date.split("T")[0] : item.id,
      }));
    }
    return [];
  } catch (error) {
    console.error(`検索記事の取得に失敗しました (${keyword}):`, error);
    return [];
  }
}
