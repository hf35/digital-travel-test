import { NewsItem } from "@/services/types/api";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Menu, TextInput } from "react-native-paper";


export default function NewsFilter({ newsData, onFilterNews }:
    { newsData: NewsItem[], onFilterNews: (news: NewsItem[]) => void }) {
    const [searchText, setSearchText] = useState("");
    const [selectedSource, setSelectedSource] = useState("");
    const [menuVisible, setMenuVisible] = useState(false);
    const [k, setK] = useState(0);

    const sources = Array.from(new Set(newsData.map((item) => item.news_site)));

    useEffect(() => {
        const filteredNews = newsData.filter((item) => {
            const matchesTitle = searchText !== "" ? item.title.toLowerCase().includes(searchText.toLowerCase()) : true;
            const matchesSource = selectedSource ? item.news_site === selectedSource : true;
            return matchesTitle && matchesSource;
        });
        onFilterNews(filteredNews);
        setK(k + 1);
    }, [searchText, selectedSource]);

    console.log("menuVisible", menuVisible);

    return (
     
        <View style={styles.container}>
            <Menu
                key={k}
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={<View collapsable={false} >
                    <Button mode="outlined"  onPress={() => setMenuVisible(true)} icon={"chevron-down"} 
       
                    contentStyle={{flexDirection: 'row-reverse', backgroundColor: 'white' }}>
                        {selectedSource ? `Источник: ${selectedSource}` : "Все источники"}
                    </Button>
                </View>}
            >
                <Menu.Item onPress={() => {
                    setMenuVisible(false)
                    setSelectedSource("")
                }}
                    title="Все источники" />
                {sources.map((source) => (
                    <Menu.Item
                        key={source}
                        onPress={() => {
                            setSelectedSource(source);
                            setMenuVisible(false)
                        }}
                        title={source}
                    />
                ))}
            </Menu>
            <View style={styles.searchBox}>
                <TextInput
                    label="Поиск по заголовку"
                    value={searchText}
                    onChangeText={setSearchText}
                    style={styles.inputText}
                />
                <Button mode="outlined"
                    onPress={() => {
                        setSelectedSource("");
                        setSearchText("")
                    }}
                    contentStyle={styles.button}>{"Сброс"}</Button>
            </View>

        </View>

    );
}

const styles = StyleSheet.create({
    container: { marginBottom: 8 },
    searchBox: { display: 'flex', flexDirection: 'row', gap: 8, marginVertical: 16 },
    inputText: { flex: 1, height: 56, backgroundColor: 'white' },
    button: { height: 56, backgroundColor: 'white' }
})