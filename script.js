// ==================== DATA ====================
        // Array of all hotels
        var hotels = [
            { id: 1, name: "Grand Plaza Hotel", location: "New York, USA", price: 250, rating: 4.8, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400" },
            { id: 2, name: "Sunset Beach Resort", location: "Miami, USA", price: 180, rating: 4.6, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400" },
            { id: 3, name: "Ruposhi Bangla Hotel", location: "Dhaka, Bangladesh", price: 85, rating: 4.5, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400" },
            { id: 4, name: "Pan Pacific Sonargaon", location: "Dhaka, Bangladesh", price: 120, rating: 4.7, image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400" },
            { id: 5, name: "Cox's Bazar Beach Resort", location: "Cox's Bazar, Bangladesh", price: 95, rating: 4.6, image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400" },
            { id: 6, name: "The Ritz London", location: "London, UK", price: 450, rating: 4.9, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400" },
            { id: 7, name: "Burj Al Arab", location: "Dubai, UAE", price: 850, rating: 5.0, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400" },
            { id: 8, name: "Taj Mahal Palace", location: "Mumbai, India", price: 200, rating: 4.8, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400" },
            { id: 9, name: "Marina Bay Sands", location: "Singapore", price: 380, rating: 4.8, image: "https://images.unsplash.com/photo-1495365200479-c4ed1d35e1aa?w=400" },
            { id: 10, name: "Shangri-La Tokyo", location: "Tokyo, Japan", price: 420, rating: 4.9, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400" }
        ];

        // Variables to store current state
        var filteredHotels = [];
        var selectedHotel = null;
        var nights = 1;

        // ==================== SETUP ====================
        // Set minimum date to today for date inputs
        var today = new Date().toISOString().split('T')[0];
        document.getElementById('checkin').min = today;
        document.getElementById('checkout').min = today;

        // Populate destination dropdown with unique locations
        var destinations = document.getElementById('destinations');
        for (var i = 0; i < hotels.length; i++) {
            var option = document.createElement('option');
            option.value = hotels[i].location;
            destinations.appendChild(option);
        }

        // Initialize Bootstrap modal for booking
        var modal = new bootstrap.Modal(document.getElementById('bookingModal'));

        // ==================== SEARCH HOTELS ====================
        document.getElementById('searchForm').onsubmit = function(e) {
            e.preventDefault();
            
            // Get search destination
            var dest = document.getElementById('destination').value.toLowerCase();
            
            // Calculate number of nights
            var checkin = new Date(document.getElementById('checkin').value);
            var checkout = new Date(document.getElementById('checkout').value);
            var diff = checkout - checkin;
            nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
            if (nights < 1) nights = 1;

            // Filter hotels by destination
            filteredHotels = [];
            for (var i = 0; i < hotels.length; i++) {
                if (!dest || hotels[i].location.toLowerCase().indexOf(dest) !== -1) {
                    filteredHotels.push(hotels[i]);
                }
            }
            
            // Show filter section and hotels using Bootstrap's d-none class
            document.getElementById('filterSection').classList.remove('d-none');
            document.getElementById('hotelsSection').classList.remove('d-none');
            
            showHotels();
            document.getElementById('hotelsSection').scrollIntoView({ behavior: 'smooth' });
        };

        // ==================== SORT HOTELS ====================
        document.getElementById('sortBy').onchange = function() {
            var value = this.value;
            
            // Simple bubble sort
            for (var i = 0; i < filteredHotels.length; i++) {
                for (var j = i + 1; j < filteredHotels.length; j++) {
                    var swap = false;
                    
                    if (value === 'price-asc' && filteredHotels[i].price > filteredHotels[j].price) {
                        swap = true;
                    } else if (value === 'price-desc' && filteredHotels[i].price < filteredHotels[j].price) {
                        swap = true;
                    } else if (value === 'rating-desc' && filteredHotels[i].rating < filteredHotels[j].rating) {
                        swap = true;
                    }
                    
                    if (swap) {
                        var temp = filteredHotels[i];
                        filteredHotels[i] = filteredHotels[j];
                        filteredHotels[j] = temp;
                    }
                }
            }
            
            showHotels();
        };

        // ==================== FILTER BY PRICE ====================
        document.getElementById('filterPrice').onchange = function() {
            var maxPrice = parseInt(this.value) || 99999;
            var dest = document.getElementById('destination').value.toLowerCase();
            
            // Start with all hotels or filtered by destination
            filteredHotels = [];
            for (var i = 0; i < hotels.length; i++) {
                var matchesDest = !dest || hotels[i].location.toLowerCase().indexOf(dest) !== -1;
                var matchesPrice = hotels[i].price < maxPrice;
                
                if (matchesDest && matchesPrice) {
                    filteredHotels.push(hotels[i]);
                }
            }
            
            showHotels();
        };

        // ==================== DISPLAY HOTELS ====================
        function showHotels() {
            var grid = document.getElementById('hotelsGrid');
            var html = '';
            
            if (filteredHotels.length === 0) {
                html = '<div class="col-12"><p class="text-center text-muted">No hotels found</p></div>';
            } else {
                for (var i = 0; i < filteredHotels.length; i++) {
                    var hotel = filteredHotels[i];
                    
                    // Bootstrap grid column - col-md-4 creates 3 columns on medium+ screens
                    html += '<div class="col-md-4">';
                    // Bootstrap card component for each hotel
                    // h-100: Height 100% to make all cards same height
                    html += '<div class="card h-100">';
                    // Bootstrap card-img-top class for image at top of card
                    html += '<img src="' + hotel.image + '" class="card-img-top hotel-img" alt="' + hotel.name + '">';
                    // Bootstrap card-body for content area
                    html += '<div class="card-body">';
                    // Bootstrap flexbox utilities: d-flex (display flex), justify-content-between (space between), align-items-start (align top)
                    // mb-2: Margin bottom of 2 units
                    html += '<div class="d-flex justify-content-between align-items-start mb-2">';
                    // Bootstrap card-title for card heading
                    // mb-0: Remove default margin bottom
                    html += '<h5 class="card-title mb-0">' + hotel.name + '</h5>';
                    // Bootstrap badge component for rating display
                    html += '<span class="badge rating-badge">' + hotel.rating + '</span>';
                    html += '</div>';
                    // Bootstrap text-muted utility for gray text color
                    html += '<p class="text-muted"><i class="bi bi-geo-alt"></i> ' + hotel.location + '</p>';
                    // Bootstrap spacing utility mb-3 (margin-bottom of 3 units)
                    html += '<p class="price mb-3">$' + hotel.price + ' <small class="text-muted">/ night</small></p>';
                    // Bootstrap button classes: btn (base button), btn-danger (red button), w-100 (width 100%)
                    html += '<button class="btn btn-danger w-100" onclick="openBooking(' + hotel.id + ')">Book Now</button>';
                    html += '</div></div></div>';
                }
            }
            
            grid.innerHTML = html;
        }

        // ==================== OPEN BOOKING MODAL ====================
        function openBooking(id) {
            // Find selected hotel
            for (var i = 0; i < hotels.length; i++) {
                if (hotels[i].id === id) {
                    selectedHotel = hotels[i];
                    break;
                }
            }
            
            // Calculate total price
            var total = selectedHotel.price * nights;
            
            // Build booking details HTML
            // Bootstrap font size utility fs-5 (font size level 5)
            // Bootstrap spacing utility mt-3 (margin top of 3 units)
            var html = '<p><strong>Hotel:</strong> ' + selectedHotel.name + '</p>';
            html += '<p><strong>Location:</strong> ' + selectedHotel.location + '</p>';
            html += '<p><strong>Check-in:</strong> ' + document.getElementById('checkin').value + '</p>';
            html += '<p><strong>Check-out:</strong> ' + document.getElementById('checkout').value + '</p>';
            html += '<p><strong>Guests:</strong> ' + document.getElementById('guests').value + '</p>';
            html += '<p><strong>Nights:</strong> ' + nights + '</p>';
            html += '<p><strong>Price per night:</strong> $' + selectedHotel.price + '</p>';
            html += '<p class="fs-5 mt-3"><strong>Total:</strong> $' + total + '</p>';
            
            document.getElementById('bookingDetails').innerHTML = html;
            
            // Show Bootstrap modal using modal.show() method
            modal.show();
        }

        // ==================== CONFIRM BOOKING ====================
        document.getElementById('confirmBooking').onclick = function() {
            alert('Booking confirmed for ' + selectedHotel.name + '!\n\nConfirmation details sent to your email.');
            // Hide Bootstrap modal using modal.hide() method
            modal.hide();
        };