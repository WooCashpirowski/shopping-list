import ShoppingList from '@/components/shopping-list';
import { ProtectedRoute } from '@/components/protected-route';

export default function ListPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <ShoppingList />
        </div>
      </main>
    </ProtectedRoute>
  );
}
