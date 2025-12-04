import { useReducer } from 'react';

export interface ShoppingListState {
  newItemName: string;
  newItemQty: string;
  editingId: string | null;
  editName: string;
  editQty: string;
  editCategory: string;
  showCategoryModal: boolean;
  pendingItem: { name: string; qty: string } | null;
}

type Action =
  | { type: 'SET_NEW_ITEM_NAME'; payload: string }
  | { type: 'SET_NEW_ITEM_QTY'; payload: string }
  | { type: 'RESET_NEW_ITEM' }
  | { type: 'START_EDITING'; payload: { id: string; name: string; qty: string; category: string } }
  | { type: 'SET_EDIT_NAME'; payload: string }
  | { type: 'SET_EDIT_QTY'; payload: string }
  | { type: 'SET_EDIT_CATEGORY'; payload: string }
  | { type: 'CANCEL_EDITING' }
  | { type: 'SHOW_CATEGORY_MODAL'; payload: { name: string; qty: string } }
  | { type: 'HIDE_CATEGORY_MODAL' };

const initialState: ShoppingListState = {
  newItemName: '',
  newItemQty: '',
  editingId: null,
  editName: '',
  editQty: '',
  editCategory: '',
  showCategoryModal: false,
  pendingItem: null,
};

function shoppingListReducer(state: ShoppingListState, action: Action): ShoppingListState {
  switch (action.type) {
    case 'SET_NEW_ITEM_NAME':
      return { ...state, newItemName: action.payload };
    
    case 'SET_NEW_ITEM_QTY':
      return { ...state, newItemQty: action.payload };
    
    case 'RESET_NEW_ITEM':
      return { ...state, newItemName: '', newItemQty: '' };
    
    case 'START_EDITING':
      return {
        ...state,
        editingId: action.payload.id,
        editName: action.payload.name,
        editQty: action.payload.qty,
        editCategory: action.payload.category,
      };
    
    case 'SET_EDIT_NAME':
      return { ...state, editName: action.payload };
    
    case 'SET_EDIT_QTY':
      return { ...state, editQty: action.payload };
    
    case 'SET_EDIT_CATEGORY':
      return { ...state, editCategory: action.payload };
    
    case 'CANCEL_EDITING':
      return {
        ...state,
        editingId: null,
        editName: '',
        editQty: '',
        editCategory: '',
      };
    
    case 'SHOW_CATEGORY_MODAL':
      return {
        ...state,
        showCategoryModal: true,
        pendingItem: action.payload,
      };
    
    case 'HIDE_CATEGORY_MODAL':
      return {
        ...state,
        showCategoryModal: false,
        pendingItem: null,
      };
    
    default:
      return state;
  }
}

export function useShoppingListState() {
  return useReducer(shoppingListReducer, initialState);
}
