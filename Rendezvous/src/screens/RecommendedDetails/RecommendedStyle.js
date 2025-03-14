import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff'
  },
  restaurantTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#6A0DAD'
  },
  carousel: {
    marginBottom: 12
  },
  carouselImage: {
    width: screenWidth,
    height: 220,
    resizeMode: 'cover'
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc'
  },
  noImageText: {
    fontSize: 18,
    color: '#6A0DAD'
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#6A0DAD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  iconStyle: {
    marginRight: 8
  },
  lineText: {
    fontSize: 18,
    color: '#333'
  },
  reviewText: {
    marginLeft: 4
  },
  linkText: {
    color: '#6A0DAD',
    textDecorationLine: 'underline'
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8
  },
  featureChip: {
    backgroundColor: '#E6D6F2',
    borderWidth: 1,
    borderColor: 'rgba(106, 13, 173, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#6A0DAD'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 30
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E3C16F'
  },
  cancelButtonText: {

    fontSize: 18,

    fontWeight: 'bold',
    color: '#000',
  },
  editButton: {
    backgroundColor: '#E3C16F'
  },
  editButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600'
  }
});

export default styles;