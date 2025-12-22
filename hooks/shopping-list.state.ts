import { useReducer } from 'react';
import { ShoppingListActionType } from '@/types/shopping-list-actions';

export interface ShoppingListState {
  newItemName: string;
  newItemQty: string;
  editingId: string | null;
  editName: string;
  editQty: string;
  editCategory: string;
  showCategoryModal: boolean;
  pendingItem: { name: string; qty: string } | null;
  showDeleteConfirmation: boolean;
}

type Action =
  | { type: ShoppingListActionType.SET_NEW_ITEM_NAME; payload: string }
  | { type: ShoppingListActionType.SET_NEW_ITEM_QTY; payload: string }
  | { type: ShoppingListActionType.RESET_NEW_ITEM }
  | { type: ShoppingListActionType.START_EDITING; payload: { id: string; name: string; qty: string; category: string } }
  | { type: ShoppingListActionType.SET_EDIT_NAME; payload: string }
  | { type: ShoppingListActionType.SET_EDIT_QTY; payload: string }
  | { type: ShoppingListActionType.SET_EDIT_CATEGORY; payload: string }
  | { type: ShoppingListActionType.CANCEL_EDITING }
  | { type: ShoppingListActionType.SHOW_CATEGORY_MODAL; payload: { name: string; qty: string } }
  | { type: ShoppingListActionType.HIDE_CATEGORY_MODAL }
  | { type: ShoppingListActionType.SHOW_DELETE_CONFIRMATION }
  | { type: ShoppingListActionType.HIDE_DELETE_CONFIRMATION };

const initialState: ShoppingListState = {
  newItemName: '',
  newItemQty: '',
  editingId: null,
  editName: '',
  editQty: '',
  editCategory: '',
  showCategoryModal: false,
  pendingItem: null,
  showDeleteConfirmation: false,
};

type ActionHandler = (state: ShoppingListState, action: Action) => ShoppingListState;

const actionHandlers: Record<Action['type'], ActionHandler> = {
  [ShoppingListActionType.SET_NEW_ITEM_NAME]: (state, action) => 
    ({ ...state, newItemName: (action as Extract<Action, { type: ShoppingListActionType.SET_NEW_ITEM_NAME }>).payload }),
  
  [ShoppingListActionType.SET_NEW_ITEM_QTY]: (state, action) => 
    ({ ...state, newItemQty: (action as Extract<Action, { type: ShoppingListActionType.SET_NEW_ITEM_QTY }>).payload }),
  
  [ShoppingListActionType.RESET_NEW_ITEM]: (state) => 
    ({ ...state, newItemName: '', newItemQty: '' }),
  
  [ShoppingListActionType.START_EDITING]: (state, action) => {
    const payload = (action as Extract<Action, { type: ShoppingListActionType.START_EDITING }>).payload;
    return {
      ...state,
      editingId: payload.id,
      editName: payload.name,
      editQty: payload.qty,
      editCategory: payload.category,
    };
  },
  
  [ShoppingListActionType.SET_EDIT_NAME]: (state, action) => 
    ({ ...state, editName: (action as Extract<Action, { type: ShoppingListActionType.SET_EDIT_NAME }>).payload }),
  
  [ShoppingListActionType.SET_EDIT_QTY]: (state, action) => 
    ({ ...state, editQty: (action as Extract<Action, { type: ShoppingListActionType.SET_EDIT_QTY }>).payload }),
  
  [ShoppingListActionType.SET_EDIT_CATEGORY]: (state, action) => 
    ({ ...state, editCategory: (action as Extract<Action, { type: ShoppingListActionType.SET_EDIT_CATEGORY }>).payload }),
  
  [ShoppingListActionType.CANCEL_EDITING]: (state) => ({
    ...state,
    editingId: null,
    editName: '',
    editQty: '',
    editCategory: '',
  }),
  
  [ShoppingListActionType.SHOW_CATEGORY_MODAL]: (state, action) => {
    const payload = (action as Extract<Action, { type: ShoppingListActionType.SHOW_CATEGORY_MODAL }>).payload;
    return {
      ...state,
      showCategoryModal: true,
      pendingItem: payload,
    };
  },
  
  [ShoppingListActionType.HIDE_CATEGORY_MODAL]: (state) => ({
    ...state,
    showCategoryModal: false,
    pendingItem: null,
  }),
  
  [ShoppingListActionType.SHOW_DELETE_CONFIRMATION]: (state) => ({
    ...state,
    showDeleteConfirmation: true,
  }),
  
  [ShoppingListActionType.HIDE_DELETE_CONFIRMATION]: (state) => ({
    ...state,
    showDeleteConfirmation: false,
  }),
};

function shoppingListReducer(state: ShoppingListState, action: Action): ShoppingListState {
  const handler = actionHandlers[action.type];
  return handler ? handler(state, action) : state;
}

export function useShoppingListState() {
  return useReducer(shoppingListReducer, initialState);
}
