/*
  # Create products table with updated RLS policies

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (varchar, required)
      - `description` (text, required)
      - `price` (decimal, required)
      - `created_at` (timestamp with timezone)
      - `user_id` (uuid, foreign key to auth.users, optional)

  2. Security
    - Enable RLS on `products` table
    - Add policies for:
      - Select: Anyone can view products (including anonymous users)
      - Insert: Authenticated users can create products
      - Delete: Users can only delete their own products
*/

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete their own products"
  ON products
  FOR DELETE
  TO authenticated
  USING (
    user_id IS NULL OR auth.uid() = user_id
  );

-- Insert sample data
INSERT INTO products (name, description, price)
VALUES 
  ('Laptop Pro', 'High-performance laptop for professionals', 1299.99),
  ('Wireless Mouse', 'Ergonomic wireless mouse with long battery life', 49.99),
  ('Mechanical Keyboard', 'RGB mechanical keyboard with Cherry MX switches', 129.99);