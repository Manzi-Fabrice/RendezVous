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
    marginBottom: 20,
    textAlign: 'center'
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
    fontSize: 26,
    color: 'black',
    fontWeight: '700',
    textAlign: 'center'
  },
  refreshButton: {
    padding: 8,
  },
 
  dateCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 10,
    padding: 15,
    borderColor: '#6A0DAD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  restaurantNameModified: {
    fontSize: 22,
    fontWeight: '700',
    color: '#6A0DAD',
    flex: 1,
    flexWrap: 'wrap'
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
  dateImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 12
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
  attendeesList: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  dateWithName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600'
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
  ratingContainerModified: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    marginRight: 4,
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
  findEventButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#6A0DAD',
    borderRadius: 8,
  },
  findEventButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  
});

export default styles;
