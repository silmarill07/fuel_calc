// DOM Elements
const slider = document.getElementById('slider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicatorsContainer = document.getElementById('indicators');

// Define calculation cards
const calculationCards = [
    {
        id: 'cost',
        title: 'Вартість поїздки',
        icon: 'fas fa-coins',
        inputs: [
            { id: 'distance', label: 'Відстань (км)', type: 'number', placeholder: 'Введіть відстань' },
            { id: 'consumption', label: 'Витрата палива на 100 км (л)', type: 'number', placeholder: 'Введіть витрату палива' },
            { id: 'price', label: 'Ціна палива за літр (грн)', type: 'number', placeholder: 'Введіть ціну палива' }
        ],
        calculate: function(inputs) {
            const distance = parseFloat(inputs.distance.value);
            const consumption = parseFloat(inputs.consumption.value);
            const price = parseFloat(inputs.price.value);
            
            if (isNaN(distance) || isNaN(consumption) || isNaN(price) || distance <= 0 || consumption <= 0 || price <= 0) {
                return { error: 'Будь ласка, введіть коректні значення' };
            }
            
            const cost = (distance / 100) * consumption * price;
            return { result: cost.toFixed(2) + ' грн' };
        },
        resultLabel: 'Орієнтовна вартість поїздки:'
    },
    {
        id: 'distance',
        title: 'Можлива відстань',
        icon: 'fas fa-road',
        inputs: [
            { id: 'fuel', label: 'Витрачене паливо (л)', type: 'number', placeholder: 'Введіть кількість палива' },
            { id: 'consumption', label: 'Витрата палива на 100 км (л)', type: 'number', placeholder: 'Введіть витрату палива' }
        ],
        calculate: function(inputs) {
            const fuel = parseFloat(inputs.fuel.value);
            const consumption = parseFloat(inputs.consumption.value);
            
            if (isNaN(fuel) || isNaN(consumption) || fuel <= 0 || consumption <= 0) {
                return { error: 'Будь ласка, введіть коректні значення' };
            }
            
            const distance = (fuel / consumption) * 100;
            return { result: distance.toFixed(2) + ' км' };
        },
        resultLabel: 'Ви можете проїхати:'
    },
    {
        id: 'consumption',
        title: 'Витрата палива',
        icon: 'fas fa-tachometer-alt',
        inputs: [
            { id: 'distance', label: 'Пройдена відстань (км)', type: 'number', placeholder: 'Введіть відстань' },
            { id: 'fuel', label: 'Витрачене паливо (л)', type: 'number', placeholder: 'Введіть кількість палива' }
        ],
        calculate: function(inputs) {
            const distance = parseFloat(inputs.distance.value);
            const fuel = parseFloat(inputs.fuel.value);
            
            if (isNaN(distance) || isNaN(fuel) || distance <= 0 || fuel <= 0) {
                return { error: 'Будь ласка, введіть коректні значення' };
            }
            
            const consumption = (fuel / distance) * 100;
            return { result: consumption.toFixed(2) + ' л/100км' };
        },
        resultLabel: 'Середня витрата палива:'
    }
];

// Current slide index
let currentSlide = 0;

// Initialize slider
function initSlider() {
    // Clear existing content
    slider.innerHTML = '';
    indicatorsContainer.innerHTML = '';
    
    // Generate slides
    calculationCards.forEach((card, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.id = `slide-${card.id}`;
        
        // Create slide header
        const slideHeader = document.createElement('div');
        slideHeader.className = 'slide-header';
        
        const slideIcon = document.createElement('div');
        slideIcon.className = 'slide-icon';
        slideIcon.innerHTML = `<i class="${card.icon}"></i>`;
        
        const slideTitle = document.createElement('h2');
        slideTitle.className = 'slide-title';
        slideTitle.textContent = card.title;
        
        slideHeader.appendChild(slideIcon);
        slideHeader.appendChild(slideTitle);
        
        // Create input groups
        const inputGroups = document.createElement('div');
        
        card.inputs.forEach(input => {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';
            
            const label = document.createElement('label');
            label.setAttribute('for', `${card.id}-${input.id}`);
            label.textContent = input.label;
            
            const inputElement = document.createElement('input');
            inputElement.type = input.type;
            inputElement.id = `${card.id}-${input.id}`;
            inputElement.placeholder = input.placeholder;
            
            inputGroup.appendChild(label);
            inputGroup.appendChild(inputElement);
            inputGroups.appendChild(inputGroup);
        });
        
        // Create calculate button
        const calculateBtn = document.createElement('button');
        calculateBtn.className = 'calculate-btn';
        calculateBtn.textContent = 'Розрахувати';
        calculateBtn.onclick = () => calculate(card);
        
        // Create result container
        const result = document.createElement('div');
        result.className = 'result';
        result.id = `result-${card.id}`;
        
        const resultLabel = document.createElement('p');
        resultLabel.textContent = card.resultLabel;
        
        const resultValue = document.createElement('div');
        resultValue.className = 'result-value';
        resultValue.id = `result-value-${card.id}`;
        resultValue.textContent = '0';
        
        result.appendChild(resultLabel);
        result.appendChild(resultValue);
        
        // Assemble slide
        slide.appendChild(slideHeader);
        slide.appendChild(inputGroups);
        slide.appendChild(calculateBtn);
        slide.appendChild(result);
        
        slider.appendChild(slide);
        
        // Create indicator
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (index === 0) indicator.classList.add('active');
        indicatorsContainer.appendChild(indicator);
    });
    
    updateSlider();
}

// Update slider position
function updateSlider() {
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Next slide
function nextSlide() {
    currentSlide = (currentSlide + 1) % calculationCards.length;
    updateSlider();
}

// Previous slide
function prevSlide() {
    currentSlide = (currentSlide - 1 + calculationCards.length) % calculationCards.length;
    updateSlider();
}

// Calculation function
function calculate(card) {
    // Get inputs for this card
    const inputs = {};
    card.inputs.forEach(input => {
        inputs[input.id] = document.getElementById(`${card.id}-${input.id}`);
    });
    
    // Perform calculation
    const result = card.calculate(inputs);
    
    // Display result
    const resultElement = document.getElementById(`result-${card.id}`);
    const resultValueElement = document.getElementById(`result-value-${card.id}`);
    
    if (result.error) {
        alert(result.error);
        resultElement.classList.remove('show');
    } else {
        resultValueElement.textContent = result.result;
        resultElement.classList.add('show');
    }
}

// Event Listeners
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
});

// Touch swipe support
let startX = 0;
let endX = 0;

slider.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
});

slider.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].screenX;
    if (startX - endX > 50) {
        nextSlide();
    } else if (endX - startX > 50) {
        prevSlide();
    }
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    initSlider();
    
    // Hide splash screen after animation
    setTimeout(() => {
        const splash = document.querySelector('.splash-screen');
        if (splash) splash.style.display = 'none';
    }, 3500);
});