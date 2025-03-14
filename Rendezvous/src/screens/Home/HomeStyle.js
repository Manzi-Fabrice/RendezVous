import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  noDateText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 20
  },
  container: {
    flex: 1
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pageTitle: {
    fontSize: 22,
    color: '#333',
    fontWeight: '700',
    textAlign: 'center'
  },
  dateCard: {
    backgroundColor: '#fff',
    margin: 12,
    marginBottom: 6,
    marginTop: 6,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1
  },
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateWithRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  withLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4
  },
  dateWithName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600'
  },
  dateImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 12
  },
  restaurantInfo: {
    marginBottom: 12
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: '#6A0DAD'
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 4
  },
  addressText: {
    fontSize: 14,
    color: '#666'
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 6
  },
  dateTimeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  attendeesList: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  additionalAttendeesLabel: {
    fontSize: 14,
    color: '#666',
  },
  viewAllLink: {
    fontSize: 14,
    color: '#6A0DAD',
    fontWeight: '600'
  },
  refreshButton: {
    padding: 8,
  },
  responseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 6
  },
  responseLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginRight: 6
  },
  responseText: {
    fontSize: 14,
    color: '#666',
  },
});

export default styles;