// AuthContext.tsx
import LoginModal from "@/components/LoginModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";
import React, { createContext, useEffect, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";

export type AuthContextType = {
    authChecked: boolean;
    isAuth: boolean;
    doAuth: () => Promise<boolean>;
    doLogout: () => Promise<void>;
    requireAuth: (fn: () => void | Promise<void>) => Promise<void>;
    openLoginModal: () => void;
};

export const AuthContext = createContext<AuthContextType>({
    authChecked: false,
    isAuth: false,
    doAuth: async () => false,
    doLogout: async () => { },
    requireAuth: async () => { },
    openLoginModal: () => { },
});

export const AuthProvider = ({ children }: any) => {
    const [authChecked, setAuthChecked] = useState(false);
    const [isAuth, setIsAuth] = useState(Platform.select({ web: true, default: false }));
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [fnAfterAuth, setFnAfterAuth] = useState<() => void>(() => () => { });

    // выполняем проверку при старте приложения
    useEffect(() => {
        (async () => {
            // например: проверить кеш, токен, флаг био
            const saved = await AsyncStorage.getItem("isAuth");

            if (saved === "1") {
                setIsAuth(true);
            }

            setAuthChecked(true); // 👈 вот тут применяется
        })();
    }, []);

    const doAuth = async () => {
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Войти",
        });

        if (result.success) {
            setIsAuth(true);
            await AsyncStorage.setItem("isAuth", "1");
            setLoginModalVisible(false);
            try {

                fnAfterAuth();
            }
            finally {
                setFnAfterAuth(() => { });
            }

        }

        return result.success;
    };

    const doLogout = async () => {
        setIsAuth(false);
        await AsyncStorage.removeItem("isAuth");
    };

    const requireAuth = async (fn: () => any) => {
        if (isAuth) return fn();
        setFnAfterAuth(() => fn);
        setLoginModalVisible(true);
    };

    const openLoginModal = () => {
        setLoginModalVisible(true);
    }


    return (
        <AuthContext.Provider
            value={{
                authChecked,
                isAuth,
                doAuth,
                doLogout,
                requireAuth,
                openLoginModal,
            }}
        >
            {/* пока нет authChecked — можно показать загрузку */}
            {!authChecked ? (
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                children
            )}

            {loginModalVisible && (
                <LoginModal
                    visible={loginModalVisible}
                    onClose={() => {
                        setLoginModalVisible(false)
                        router.replace("/");
                    }
                    }
                />
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);