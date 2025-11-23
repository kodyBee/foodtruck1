import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const menuData = [
  // Wings
  { name: "Lemon Pepper Wings", description: "Crispy wings tossed in our signature lemon pepper seasoning", price: "$12.99", category: "Wings" },
  { name: "Hot Wings", description: "Classic buffalo hot wings with a kick", price: "$12.99", category: "Wings" },
  { name: "BBQ Wings", description: "Sweet and tangy barbecue glazed wings", price: "$12.99", category: "Wings" },
  { name: "Honey Hot Wings", description: "Perfect balance of sweet honey and spicy heat", price: "$12.99", category: "Wings" },
  { name: "Garlic Parmesan Wings", description: "Savory garlic and parmesan cheese coating", price: "$12.99", category: "Wings" },
  { name: "Teriyaki Wings", description: "Asian-inspired sweet teriyaki glaze", price: "$12.99", category: "Wings" },
  { name: "Mango Habanero Wings", description: "Tropical sweetness meets fiery habanero", price: "$12.99", category: "Wings" },
  { name: "Cajun Wings", description: "Bold Cajun spices with Louisiana flair", price: "$12.99", category: "Wings" },
  
  // Sandwiches & Cheesesteaks
  { name: "Classic Philly Cheesesteak", description: "Thinly sliced ribeye, grilled onions, peppers, and melted cheese", price: "$14.99", category: "Sandwiches & Cheesesteaks" },
  { name: "Chicken Cheesesteak", description: "Grilled chicken breast with peppers, onions, and cheese", price: "$13.99", category: "Sandwiches & Cheesesteaks" },
  { name: "BBQ Chicken Sandwich", description: "Pulled BBQ chicken with coleslaw on a brioche bun", price: "$12.99", category: "Sandwiches & Cheesesteaks" },
  { name: "Buffalo Chicken Sandwich", description: "Crispy chicken tossed in buffalo sauce with ranch", price: "$12.99", category: "Sandwiches & Cheesesteaks" },
  { name: "Spicy Italian Sausage", description: "Grilled Italian sausage with peppers and onions", price: "$11.99", category: "Sandwiches & Cheesesteaks" },
  
  // Mac & Cheese Bowls
  { name: "Classic Mac & Cheese", description: "Creamy three-cheese mac and cheese", price: "$8.99", category: "Mac & Cheese Bowls" },
  { name: "Buffalo Chicken Mac", description: "Mac and cheese topped with buffalo chicken", price: "$13.99", category: "Mac & Cheese Bowls" },
  { name: "BBQ Pulled Pork Mac", description: "Mac and cheese with slow-cooked BBQ pulled pork", price: "$14.99", category: "Mac & Cheese Bowls" },
  { name: "Lobster Mac & Cheese", description: "Premium lobster meat in creamy cheese sauce", price: "$18.99", category: "Mac & Cheese Bowls" },
  { name: "Bacon Jalapeño Mac", description: "Crispy bacon and jalapeños for a spicy kick", price: "$12.99", category: "Mac & Cheese Bowls" },
  
  // Loaded Fries
  { name: "Philly Cheese Fries", description: "Fries topped with steak, cheese, peppers, and onions", price: "$11.99", category: "Loaded Fries" },
  { name: "Buffalo Chicken Fries", description: "Crispy fries with buffalo chicken and ranch drizzle", price: "$11.99", category: "Loaded Fries" },
  { name: "Bacon Cheese Fries", description: "Loaded with crispy bacon and melted cheese", price: "$9.99", category: "Loaded Fries" },
  { name: "Cajun Fries", description: "Seasoned fries with bold Cajun spices", price: "$7.99", category: "Loaded Fries" },
  { name: "Truffle Parmesan Fries", description: "Gourmet fries with truffle oil and parmesan", price: "$10.99", category: "Loaded Fries" },
  
  // Waffles & Sweets
  { name: "Red Velvet Waffles", description: "Rich red velvet waffles with cream cheese drizzle", price: "$9.99", category: "Waffles & Sweets" },
  { name: "Chicken & Waffles", description: "Crispy fried chicken on golden Belgian waffles", price: "$15.99", category: "Waffles & Sweets" },
  { name: "Churro Waffles", description: "Cinnamon sugar waffles with caramel sauce", price: "$8.99", category: "Waffles & Sweets" },
  { name: "Banana Foster Waffles", description: "Caramelized bananas with rum sauce", price: "$10.99", category: "Waffles & Sweets" },
  { name: "Funnel Cake Fries", description: "Crispy funnel cake strips dusted with powdered sugar", price: "$7.99", category: "Waffles & Sweets" },
  
  // Sides
  { name: "French Fries", description: "Crispy golden french fries", price: "$4.99", category: "Sides" },
  { name: "Onion Rings", description: "Beer-battered onion rings", price: "$5.99", category: "Sides" },
  { name: "Coleslaw", description: "Creamy homemade coleslaw", price: "$3.99", category: "Sides" },
  { name: "Corn on the Cob", description: "Grilled corn with butter and seasoning", price: "$4.99", category: "Sides" },
  { name: "Side Salad", description: "Fresh mixed greens with choice of dressing", price: "$5.99", category: "Sides" },
  
  // Beverages
  { name: "Soft Drinks", description: "Coke, Sprite, Dr Pepper, Fanta", price: "$2.99", category: "Beverages" },
  { name: "Sweet Tea", description: "Southern-style sweet tea", price: "$2.99", category: "Beverages" },
  { name: "Lemonade", description: "Freshly made lemonade", price: "$3.49", category: "Beverages" },
  { name: "Bottled Water", description: "Premium bottled water", price: "$1.99", category: "Beverages" },
  { name: "Energy Drinks", description: "Red Bull, Monster", price: "$3.99", category: "Beverages" },
];

async function main() {
  console.log('Start seeding menu items...');
  
  // Check if menu items already exist
  const existingItems = await prisma.menuItem.count();
  
  if (existingItems > 0) {
    console.log(`Database already has ${existingItems} menu items. Skipping seed.`);
    console.log('If you want to reseed, delete all menu items first.');
    return;
  }
  
  // Create menu items
  for (const item of menuData) {
    await prisma.menuItem.create({
      data: item,
    });
  }
  
  console.log(`✅ Seeded ${menuData.length} menu items successfully!`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
