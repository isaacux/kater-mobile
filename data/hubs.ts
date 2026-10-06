import type { DietaryTag, Hub, Meal, Vendor } from './types';

/**
 * Placeholder images. Each is a plain URL so real photography can be
 * dropped in later without code changes.
 */
function placeholder(text: string, bg: string, fg: string, size = '800x500') {
  return `https://placehold.co/${size}/${bg}/${fg}/png?text=${encodeURIComponent(text)}`;
}

const vendorImage = (name: string) => placeholder(name, '141414', 'FFC400');
const mealImage = (name: string) => placeholder(name, 'FFF3C4', '141414', '600x400');

type MealSeed = [name: string, description: string, tags: DietaryTag[]];

function meals(vendorId: string, seeds: MealSeed[]): Meal[] {
  return seeds.map(([name, description, tags], i) => ({
    id: `${vendorId}-m${i + 1}`,
    name,
    description,
    image: mealImage(name),
    tags,
  }));
}

function vendor(
  id: string,
  name: string,
  cuisine: string,
  pricePerMeal: number,
  deliveryWindow: string,
  mealSeeds: MealSeed[],
): Vendor {
  return {
    id,
    name,
    cuisine,
    image: vendorImage(name),
    pricePerMeal,
    deliveryWindow,
    meals: meals(id, mealSeeds),
  };
}

const auntieMunis = vendor(
  'auntie-munis',
  "Auntie Muni's Kitchen",
  'Ghanaian home cooking',
  55,
  '11:30am to 12:00pm',
  [
    ['Jollof Rice & Grilled Chicken', 'Smoky party jollof with charcoal-grilled chicken thigh, coleslaw and fried plantain.', ['Spicy', 'High protein']],
    ['Waakye Special', 'Rice and beans with wele, boiled egg, gari, spaghetti, salad and shito on the side.', ['Spicy']],
    ['Banku & Grilled Tilapia', 'Soft banku with whole grilled tilapia, fresh pepper and onion relish.', ['Seafood', 'Spicy', 'Gluten-free']],
    ['Red Red & Plantain', 'Black-eyed bean stew cooked in red palm oil, served with sweet fried plantain.', ['Vegan', 'Gluten-free']],
    ['Fried Rice & Chicken', 'Vegetable fried rice with crispy fried chicken and a side of shito.', ['High protein']],
    ['Kontomire Stew & Yam', 'Cocoyam leaf stew with egusi and boiled yam. Ask for extra pepper.', ['Vegetarian', 'Gluten-free']],
    ['Omo Tuo & Groundnut Soup', 'Rice balls with rich groundnut soup and tender chicken.', ['Contains nuts', 'Gluten-free']],
  ],
);

const accraGrill = vendor(
  'accra-grill',
  'Accra Grill House',
  'Grills & bowls',
  65,
  '12:00pm to 12:30pm',
  [
    ['Suya Beef Bowl', 'Spiced suya beef strips over jollof rice with pickled onions and peanut dust.', ['Spicy', 'Contains nuts', 'High protein']],
    ['Peri-Peri Chicken Plate', 'Half-chicken in peri-peri glaze with chips and garden salad.', ['Spicy', 'High protein']],
    ['Grilled Fish & Yam Chips', 'Lemon-pepper red snapper fillet with crispy yam chips and tartare.', ['Seafood']],
    ['Halloumi & Veg Skewers', 'Charred halloumi, peppers and courgette with herbed couscous.', ['Vegetarian']],
    ['Chicken Shawarma Wrap', 'Marinated chicken, garlic sauce and salad in a toasted wrap with fries.', ['High protein']],
    ['Kelewele Power Bowl', 'Spiced plantain, black beans, avocado, rice and tomato salsa.', ['Vegan', 'Spicy', 'Gluten-free']],
  ],
);

const greenBowl = vendor(
  'green-bowl',
  'Green Bowl Co.',
  'Healthy & plant-forward',
  70,
  '11:45am to 12:15pm',
  [
    ['Avocado Quinoa Salad', 'Quinoa, avocado, cherry tomatoes, cucumber and lime dressing.', ['Vegan', 'Gluten-free']],
    ['Grilled Chicken Caesar', 'Romaine, grilled chicken, parmesan, croutons and light Caesar dressing.', ['High protein']],
    ['Coconut Lentil Curry', 'Red lentils simmered in coconut milk with brown rice.', ['Vegan', 'Spicy', 'Gluten-free']],
    ['Teriyaki Salmon Bowl', 'Glazed salmon, sticky rice, edamame and pickled cabbage.', ['Seafood', 'High protein']],
    ['Falafel & Hummus Plate', 'Crispy falafel, hummus, tabbouleh and warm pitta.', ['Vegetarian']],
    ['Sweet Potato Buddha Bowl', 'Roasted sweet potato, chickpeas, kale and tahini.', ['Vegan', 'Gluten-free']],
    ['Chicken & Veg Stir-Fry', 'Wok-fried chicken with seasonal vegetables and noodles.', ['High protein']],
    ['Mushroom Wholewheat Pasta', 'Creamy mushroom sauce, spinach and parmesan.', ['Vegetarian']],
  ],
);

const chopBar = vendor(
  'chop-bar-royale',
  'Chop Bar Royale',
  'Traditional chop bar',
  50,
  '12:00pm to 12:30pm',
  [
    ['Fufu & Light Soup with Goat', 'Freshly pounded fufu with spicy light soup and goat meat.', ['Spicy', 'Gluten-free']],
    ['Kenkey & Fried Fish', 'Ga kenkey with fried fish, fresh pepper and shito.', ['Seafood', 'Spicy']],
    ['Banku & Okro Stew', 'Banku with okro stew, crab and wele.', ['Seafood', 'Spicy']],
    ['Ampesi & Garden Egg Stew', 'Boiled yam and plantain with garden egg stew.', ['Vegetarian', 'Gluten-free']],
    ['Tuo Zaafi & Ayoyo Soup', 'Northern-style TZ with ayoyo soup and beef.', ['Gluten-free']],
    ['Jollof & Fried Fish', 'Classic jollof with fried fish and shito.', ['Seafood', 'Spicy']],
    ['Gari Foto & Egg', 'Gari cooked in tomato and onion sauce with boiled egg and plantain.', ['Vegetarian']],
  ],
);

const osuSpice = vendor(
  'osu-spice',
  'Osu Spice Kitchen',
  'Afro-Asian fusion',
  60,
  '11:30am to 12:00pm',
  [
    ['Shito Fried Noodles', 'Wok-tossed noodles with shito, vegetables and beef.', ['Spicy']],
    ['Thai Green Curry', 'Chicken green curry with jasmine rice.', ['Spicy', 'Gluten-free']],
    ['Veg Spring Rolls & Fried Rice', 'Crispy spring rolls with egg fried rice and sweet chilli.', ['Vegetarian']],
    ['Sweet & Sour Fish', 'Battered tilapia in sweet and sour sauce with rice.', ['Seafood']],
    ['Tofu Peanut Stir-Fry', 'Crispy tofu, peppers and groundnut sauce over rice.', ['Vegan', 'Contains nuts']],
    ['Chicken Katsu Curry', 'Panko chicken with mild curry sauce and rice.', ['High protein']],
  ],
);

const freshLean = vendor(
  'fresh-lean',
  'Fresh & Lean',
  'Protein & salads',
  75,
  '12:15pm to 12:45pm',
  [
    ['Grilled Chicken & Brown Rice', 'Herb chicken breast, brown rice and steamed greens.', ['High protein', 'Gluten-free']],
    ['Tuna Nicoise Salad', 'Tuna, egg, green beans, potatoes and olives.', ['Seafood', 'Gluten-free']],
    ['Beef & Broccoli Bowl', 'Lean beef strips, broccoli and wholegrain rice.', ['High protein']],
    ['Lentil & Feta Salad', 'Puy lentils, feta, rocket and roasted peppers.', ['Vegetarian', 'Gluten-free']],
    ['Prawn Avocado Bowl', 'Garlic prawns, avocado, mango and wild rice.', ['Seafood', 'Gluten-free']],
    ['Vegan Chilli & Rice', 'Three-bean chilli with rice and fresh salsa.', ['Vegan', 'Spicy', 'Gluten-free']],
    ['Turkey Meatballs & Pasta', 'Turkey meatballs in tomato sauce with wholewheat pasta.', ['High protein']],
  ],
);

const bistro233 = vendor(
  'bistro-233',
  'Bistro 233',
  'Continental',
  80,
  '12:00pm to 12:30pm',
  [
    ['Beef Lasagne', 'Layered beef ragu, béchamel and mozzarella with side salad.', []],
    ['Chicken Alfredo', 'Fettuccine in creamy parmesan sauce with grilled chicken.', []],
    ['Grilled Salmon & Mash', 'Salmon fillet, buttery mash and lemon butter sauce.', ['Seafood', 'Gluten-free']],
    ['Mushroom Risotto', 'Arborio rice with wild mushrooms and parmesan.', ['Vegetarian', 'Gluten-free']],
    ['Club Sandwich & Fries', 'Triple-decker chicken, bacon, egg and lettuce.', []],
    ['Margherita Flatbread', 'Tomato, mozzarella and basil on a crisp flatbread.', ['Vegetarian']],
    ['Steak Frites', 'Grilled sirloin with fries and pepper sauce.', ['High protein', 'Gluten-free']],
    ['Penne Arrabbiata', 'Penne in a fiery tomato and garlic sauce.', ['Vegan', 'Spicy']],
  ],
);

export const HUBS: Hub[] = [
  {
    code: 'TOTAL24',
    companyName: 'Totality Energy Ghana',
    deliveryLocations: [
      { id: 'tot-gf', label: 'Ground Floor Reception', detail: 'Main lobby, by the security desk' },
      { id: 'tot-3f', label: '3rd Floor', detail: 'Finance & HR kitchen' },
      { id: 'tot-5f', label: '5th Floor', detail: 'Engineering pantry' },
      { id: 'tot-7f', label: '7th Floor', detail: 'Executive suite' },
    ],
    vendors: [auntieMunis, accraGrill, greenBowl],
  },
  {
    code: 'OMA2026',
    companyName: 'Omanye Capital',
    deliveryLocations: [
      { id: 'oma-ac', label: 'Airport City Branch', detail: 'Block B, 2nd Floor canteen' },
      { id: 'oma-ridge', label: 'Ridge Head Office', detail: 'Main reception' },
      { id: 'oma-osu', label: 'Osu Branch', detail: 'Oxford Street, staff room' },
    ],
    vendors: [chopBar, osuSpice, freshLean, bistro233],
  },
];

/** Normalises user input so hub codes are case- and whitespace-insensitive. */
export function normaliseHubCode(input: string) {
  return input.replace(/\s+/g, '').toUpperCase();
}

export function findHub(code: string): Hub | undefined {
  const normalised = normaliseHubCode(code);
  return HUBS.find((h) => h.code === normalised);
}

export function findVendor(hub: Hub, vendorId: string): Vendor | undefined {
  return hub.vendors.find((v) => v.id === vendorId);
}
