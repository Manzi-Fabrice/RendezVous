import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6A0DAD',
    marginVertical: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#6A0DAD',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#6A0DAD',
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#6A0DAD',
  },
  cardImage: {
    width: '100%',
    height: 170,
    backgroundColor: '#eee',
  },
  cardContent: {
    padding: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flexShrink: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#6A0DAD',
    fontWeight: 'bold',
    marginRight: 4,
  },
  starIcon: {
    marginTop: 1,
  },
  secondRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceRange: {
    fontSize: 14,
    color: '#6A0DAD',
    fontWeight: 'bold',
  },
  dot: {
    marginHorizontal: 6,
    fontSize: 14,
    color: '#888',
  },
  shortDesc: {
    fontSize: 14,
    color: '#666',
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
  },
  addressText: {
    fontSize: 13,
    color: '#999',
  },
});

export default styles;