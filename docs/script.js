// 🔧 Step 1: Firebase Config (replace with your own from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyDK5Dat1h8rHJNpQZcZN84ON2tOWpUQwzc",
  authDomain: "millicent-portfolio.firebaseapp.com",
  projectId: "millicent-portfolio",
  storageBucket: "millicent-portfolio.appspot.com", // ✅ corrected
  messagingSenderId: "756958453527",
  appId: "1:756958453527:web:0844b485b5cf3293686152",
  measurementId: "G-EMFHEH3QNG"
};

// 🔧 Step 2: Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🔧 Step 3: Handle Form Submission
const form = document.getElementById("testimonial-form");

form.addEventListener("submit", async function(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const position = document.getElementById("position").value.trim();
  let rating = parseInt(document.getElementById("rating").value, 10);
  const testimonial = document.getElementById("testimonial").value.trim();

  // ✅ Ensure rating is between 1–5
  rating = Math.min(Math.max(rating, 1), 5);

  if (name && position && testimonial) {
    await db.collection("testimonials").add({
      name,
      position,
      rating,
      testimonial,
      createdAt: new Date()
    });
    form.reset();
  } else {
    alert("Please fill in all fields before submitting.");
  }
});

// 🔧 Step 4: Load Testimonials
db.collection("testimonials").orderBy("createdAt", "desc").onSnapshot(snapshot => {
  const testimonialsRow = document.querySelector("#testimonials .row");
  testimonialsRow.innerHTML = "";

  snapshot.forEach(doc => {
    const t = doc.data();
    const col = document.createElement("div");
    col.className = "col-lg-3 col-md-6 mb-4";
    col.innerHTML = `
      <div class="card shadow-sm border-0 h-100">
        <img src="https://via.placeholder.com/150x100?text=${encodeURIComponent(t.name)}" 
             class="card-img-top" alt="${t.name}">
        <div class="card-body">
          <p class="card-text">"${t.testimonial}"</p>
          <div class="text-warning mb-2">
            ${"★".repeat(t.rating)}${"☆".repeat(5 - t.rating)}
          </div>
          <h6 class="card-subtitle text-muted mt-3">${t.name}, ${t.position}</h6>
        </div>
      </div>
    `;
    testimonialsRow.appendChild(col);
  });
});
