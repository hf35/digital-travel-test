
export type NewsItem = {
    id: number;
    title: string;
    url: string;
    image_url: string;
    news_site: string;
    summary: string;
    published_at: string;
    updated_at: string;
    featured: boolean;
    launches: Array<{
        id: string;
        provider: string;
    }>;
    authors: Array<{ name: string, socials?: Record<string, string | null> }>;
    events: Array<{
        id: string;
        provider: string;
    }>;
}

export type NewsData = {
    count: number;
    next: string;
    previous: string;
    results: NewsItem[];
}


export type ApiResponse = {
    ok: boolean;
    status: number;
    news?: NewsItem[] | null;
    error?: string | null;
    totalResults?: number;
};

export const SPACE_NEWS_BASE_URL = "https://api.spaceflightnewsapi.net/v4/articles/";