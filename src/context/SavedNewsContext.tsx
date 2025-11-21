import { NewsItem } from "@/services/types/api";
import { NewsStorage } from "@/storage/NewsStorage";
import { createContext, useContext, useEffect, useState } from "react";

type SavedNewsContextType = {
    saved: NewsItem[];
    save: (item: NewsItem) => void;
    remove: (id: number) => void;
    isSaved: (id: number) => Promise<boolean>;
    refresh: () => void;
};

const SavedNewsContext = createContext<SavedNewsContextType>({
    saved: [],
    save: () => { },
    remove: () => { },
    refresh: () => { },
    isSaved:  () => Promise.resolve(false),
});

export const SavedNewsProvider = ({ children }: any) => {
    const [saved, setSaved] = useState<NewsItem[]>([]);

    const refresh = async () => {
        const all = await NewsStorage.getAll();
        setSaved(all);
    };

    useEffect(() => {
        refresh();
    }, []);

    const save = async (item: NewsItem) => {
        const isSaved = saved.some((n) => n.id === item.id);
        if (isSaved) {
            return;
        }
        await NewsStorage.save(item);

        refresh();
    };

    const isSaved = async (id: number) => {

        return saved.some((n) => n.id === id);
    };

    const remove = async (id: number) => {
        await NewsStorage.remove(id);
        refresh();
    };

    return (
        <SavedNewsContext.Provider value={{ saved, save, remove, refresh, isSaved }}>
            {children}
        </SavedNewsContext.Provider>
    );
};

export const useSavedNews = () => useContext(SavedNewsContext);
