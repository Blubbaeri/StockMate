import { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { supabase } from "../../../lib/supabase";

// ─── Theme (StockMate — Clean Light) ──────────────────────────────────────────

const C = {
    bg: "#F2F2F7",
    surface: "#FFFFFF",
    surfaceHigh: "#FFFFFF",
    border: "#E5E5EA",
    borderSoft: "#F0F0F5",
    primary: "#007AFF",
    primaryGlow: "rgba(0,122,255,0.06)",
    primaryBorder: "rgba(0,122,255,0.2)",
    primaryText: "#007AFF",
    text: "#1C1C1E",
    textSub: "#8E8E93",
    textMid: "#AEAEB2",
    muted: "#C7C7CC",
    accent: "#007AFF",
    accentLight: "#E5F1FF",
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function LoginScreen() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(24))[0];
    const logoScale = useState(new Animated.Value(0.92))[0];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
            Animated.spring(logoScale, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleLogin = async () => {
        if (!identifier || !password) {
            Alert.alert("Error", "Email/Username and Password cannot be empty");
            return;
        }
        setLoading(true);
        let loginEmail = identifier;
        const isEmail = identifier.includes("@");

        if (!isEmail) {
            const { data: profileData, error: lookupError } = await supabase
                .from("user_profiles")
                .select("email")
                .eq("nickname", identifier)
                .single();
            if (lookupError || !profileData?.email) {
                setLoading(false);
                Alert.alert("Login Failed", "Username not found or not integrated yet.");
                return;
            }
            loginEmail = profileData.email;
        }

        const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
        setLoading(false);

        if (error) {
            Alert.alert("Login Failed", error.message);
        } else {
            router.replace("/(tabs)/dashboard");
        }
    };

    const handleForgotPassword = () => {
        router.push("/(auth)/forgot-password");
    };

    return (
        <View style={styles.root}>
            {/* Subtle decorative orbs */}
            <View style={styles.orbTopLeft} />
            <View style={styles.orbBottomRight} />

            <KeyboardAvoidingView
                style={styles.kav}
                behavior="padding"
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    automaticallyAdjustKeyboardInsets={false}
                    bounces={false}
                >
                    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

                        {/* ── Brand Mark ── */}
                        <Animated.View style={[styles.brandRow, { transform: [{ scale: logoScale }] }]}>
                            <View style={styles.logoMark}>
                                <Ionicons name="cube" size={22} color="#FFFFFF" />
                            </View>
                            <View>
                                <Text style={styles.brandName}>StockMate</Text>
                                <Text style={styles.brandTagline}>inventory made simple</Text>
                            </View>
                        </Animated.View>

                        {/* ── Heading ── */}
                        <View style={styles.headingBlock}>
                            <Text style={styles.headingWelcome}>Welcome back</Text>
                            <Text style={styles.headingMain}>
                                sign in<Text style={styles.headingDot}>.</Text>
                            </Text>
                            <Text style={styles.headingSub}>Sign in to manage your inventory.</Text>
                        </View>

                        {/* ── Inputs ── */}
                        <View style={styles.inputGroup}>
                            <Field
                                label="Email or Username"
                                placeholder="you@email.com"
                                value={identifier}
                                onChangeText={setIdentifier}
                                focused={focused === "id"}
                                onFocus={() => setFocused("id")}
                                onBlur={() => setFocused(null)}
                                autoCapitalize="none"
                            />
                            <View>
                                <Field
                                    label="Password"
                                    placeholder="••••••••••"
                                    value={password}
                                    onChangeText={setPassword}
                                    focused={focused === "pw"}
                                    onFocus={() => setFocused("pw")}
                                    onBlur={() => setFocused(null)}
                                    secureTextEntry={!showPassword}
                                    isPassword
                                    onTogglePassword={() => setShowPassword(!showPassword)}
                                    showPassword={showPassword}
                                />
                                <TouchableOpacity
                                    style={styles.forgotBtn}
                                    onPress={handleForgotPassword}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.forgotText}>Forgot password?</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* ── Login CTA ── */}
                        <TouchableOpacity
                            style={[styles.ctaBtn, loading && styles.ctaBtnLoading]}
                            activeOpacity={0.88}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <Text style={styles.ctaBtnText}>
                                {loading ? "Signing in…" : "Sign In"}
                            </Text>
                            {!loading && <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />}
                        </TouchableOpacity>

                        {/* ── Register Link ── */}
                        <TouchableOpacity
                            style={styles.registerRow}
                            activeOpacity={0.7}
                            onPress={() => router.push("/(auth)/signup")}
                        >
                            <Text style={styles.registerText}>
                                Don't have an account?{"  "}
                                <Text style={styles.registerLink}>Register now</Text>
                            </Text>
                        </TouchableOpacity>

                        {/* ── Divider ── */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* ── Footer ── */}
                        <Text style={styles.footer}>© 2026 StockMate</Text>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

// ─── Field Component ──────────────────────────────────────────────────────────

function Field({
    label, placeholder, value, onChangeText,
    focused, onFocus, onBlur, secureTextEntry = false, 
    autoCapitalize = "sentences",
    isPassword = false,
    onTogglePassword,
    showPassword
}: {
    label: string; placeholder: string; value: string;
    onChangeText: (t: string) => void; focused: boolean;
    onFocus: () => void; onBlur: () => void;
    secureTextEntry?: boolean; autoCapitalize?: "none" | "sentences" | "words" | "characters";
    isPassword?: boolean;
    onTogglePassword?: () => void;
    showPassword?: boolean;
}) {
    return (
        <View style={[fieldStyles.wrap, focused && fieldStyles.wrapFocused]}>
            <View style={fieldStyles.contentRow}>
                <View style={fieldStyles.inputBlock}>
                    <Text style={[fieldStyles.label, focused && fieldStyles.labelFocused]}>{label}</Text>
                    <TextInput
                        style={fieldStyles.input}
                        placeholder={placeholder}
                        placeholderTextColor={C.textMid}
                        value={value}
                        onChangeText={onChangeText}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        secureTextEntry={secureTextEntry}
                        autoCapitalize={autoCapitalize}
                    />
                </View>
                {isPassword && (
                    <TouchableOpacity onPress={onTogglePassword} style={fieldStyles.toggleBtn}>
                        <Ionicons 
                            name={showPassword ? "eye-off-outline" : "eye-outline"} 
                            size={20} 
                            color={focused ? C.primaryText : C.textMid} 
                        />
                    </TouchableOpacity>
                )}
            </View>
            {focused && <View style={fieldStyles.activeLine} />}
        </View>
    );
}

const fieldStyles = StyleSheet.create({
    wrap: {
        backgroundColor: C.surfaceHigh,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: C.border,
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 12,
        position: "relative",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    contentRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    inputBlock: {
        flex: 1,
    },
    toggleBtn: {
        padding: 4,
        marginLeft: 8,
    },
    wrapFocused: {
        borderColor: C.primaryBorder,
        backgroundColor: C.primaryGlow,
    },
    label: {
        fontSize: 10,
        fontWeight: "700",
        color: C.textSub,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        marginBottom: 6,
    },
    labelFocused: {
        color: C.primaryText,
    },
    input: {
        color: C.text,
        fontSize: 15,
        fontWeight: "400",
        padding: 0,
        letterSpacing: 0.2,
    },
    activeLine: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: C.primary,
    },
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: C.bg,
    },

    orbTopLeft: {
        position: "absolute",
        width: 300,
        height: 300,
        borderRadius: 150,
        top: -130,
        left: -110,
        backgroundColor: "rgba(0,122,255,0.04)",
    },
    orbBottomRight: {
        position: "absolute",
        width: 260,
        height: 260,
        borderRadius: 130,
        bottom: -90,
        right: -90,
        backgroundColor: "rgba(52,199,89,0.035)",
    },

    kav: { flex: 1 },
    scroll: {
        flexGrow: 1,
        justifyContent: "center",
        paddingVertical: 48,
        paddingHorizontal: 26,
    },

    container: {
        width: "100%",
        maxWidth: 400,
        alignSelf: "center",
    },

    // Brand
    brandRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 48,
    },
    logoMark: {
        width: 44,
        height: 44,
        borderRadius: 13,
        backgroundColor: C.primary,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        shadowColor: C.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    brandName: {
        color: C.text,
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: -0.4,
    },
    brandTagline: {
        color: C.textSub,
        fontSize: 11,
        fontWeight: "500",
        letterSpacing: 0.3,
        marginTop: 1,
    },

    // Heading
    headingBlock: {
        marginBottom: 36,
    },
    headingWelcome: {
        color: C.textSub,
        fontSize: 14,
        fontWeight: "400",
        letterSpacing: 0.2,
        marginBottom: 2,
    },
    headingMain: {
        color: C.text,
        fontSize: 44,
        fontWeight: "800",
        letterSpacing: -2,
        lineHeight: 48,
        marginBottom: 14,
    },
    headingDot: {
        color: C.primary,
    },
    headingSub: {
        color: C.textSub,
        fontSize: 14,
        lineHeight: 22,
        fontWeight: "400",
        letterSpacing: 0.1,
    },

    // Inputs
    inputGroup: {
        gap: 10,
        marginBottom: 20,
    },

    // CTA
    ctaBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: C.primary,
        borderRadius: 12,
        paddingVertical: 17,
        marginBottom: 16,
        shadowColor: C.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 8,
    },
    ctaBtnLoading: { opacity: 0.6 },
    ctaBtnText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
        letterSpacing: 0.1,
    },

    // Register
    registerRow: {
        alignItems: "center",
        paddingVertical: 6,
        marginBottom: 28,
    },
    registerText: {
        color: C.textSub,
        fontSize: 13,
        fontWeight: "400",
    },
    registerLink: {
        color: C.primaryText,
        fontWeight: "600",
    },

    // Divider
    divider: {
        marginBottom: 20,
    },
    dividerLine: {
        height: 1,
        backgroundColor: C.borderSoft,
    },

    // Forgot
    forgotBtn: {
        alignSelf: "flex-end",
        marginTop: 8,
        paddingHorizontal: 4,
    },
    forgotText: {
        color: C.primaryText,
        fontSize: 12,
        fontWeight: "600",
    },

    // Footer
    footer: {
        textAlign: "center",
        color: C.muted,
        fontSize: 11,
        fontWeight: "500",
        letterSpacing: 0.5,
    },
});
