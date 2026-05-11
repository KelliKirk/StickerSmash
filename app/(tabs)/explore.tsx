import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>File-based routing</Text>
        <Text style={styles.text}>
          This app has two screens: app/(tabs)/index.tsx and
          app/(tabs)/explore.tsx
        </Text>
        <Text style={styles.text}>
          The layout file in app/(tabs)/_layout.tsx sets up the tab navigator.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Android, iOS, and web support</Text>
        <Text style={styles.text}>
          You can open this project on Android, iOS, and the web.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: "#25292e",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  text: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 8,
  },
});
