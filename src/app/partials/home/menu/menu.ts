import { Component, inject, input, signal } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { MenuitemService } from '../../../services/menuItem.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuItem } from '../../../models/menuItem.interface';


@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-menu',
  styleUrl: './menu.scss',
  templateUrl: './menu.html',
})
export class Menu {

  //För innehåll som endast visas på dashboarden
  isDashboard = input<boolean>(false);

  //Signal meddelanden
  error = signal<string>("");
  errorCreate = signal<string>("");
  successCreate = signal<string>("");
  errorDelete = signal<string>("");
  successDelete = signal<string>("");


  //Signal till vald kategori 
  selectedCategory = signal<number | null>(null);

  //Signal redigering
  editId = signal<number | null>(null);

  //Läser in services
  categoryService = inject(CategoryService);
  menuItemService = inject(MenuitemService);

  //Validering
  menuForm = new FormGroup({
    item_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    item_price: new FormControl(<number | null>(null), [Validators.required, Validators.min(1)]),
    category_id: new FormControl(<number | null>(null), [Validators.required]),
    item_description: new FormControl('')
  });



  //Hämta data till redigering
  getDataToEdit(item: MenuItem) {
    //Om Id inte finns
    if(!item.item_id) {
      return;
    }
    //Uppdaterar signal med id
    this.editId.set(item.item_id);

    //Hämtar datan till formulärfält
    this.menuForm.setValue({
      item_name: item.item_name,
      item_price: item.item_price,
      category_id: item.category_id,
      item_description: item.item_description || ""
    });

  }

  async onSubmit() {
    if (this.menuForm.invalid) {
      return;
    }
    try {
      //Rensar tidigare meddelanden
      this.successCreate.set("");
      this.errorCreate.set("");

      //Skapar ett objekt enligt interface.
      //Säkerställer att item_price och category_id är nummer.
      const menuInput: MenuItem = {
        item_name: this.menuForm.value.item_name!,
        item_price: Number(this.menuForm.value.item_price)!,
        category_id: Number(this.menuForm.value.category_id)!,
        item_description: this.menuForm.value.item_description || ""
      };

      //Hämtar Id vid redigering
      const currentId = this.editId();

      if (currentId) {
        //Uppdaterar menyartikel
        await this.menuItemService.updateMenuItem(currentId, menuInput);
        //Meddelande vid uppdaterad menyartikel.
        this.successCreate.set(`Menyartikel har uppdaterats: ${menuInput.item_name}`);
        //Sätter signal till null.
        this.editId.set(null);
      } else {

      //Skapar menyartikel
      await this.menuItemService.createMenuItem(menuInput);

      //Meddelande vid skapad kategori.
      this.successCreate.set(`Menyartikel skapad: ${menuInput.item_name}`)
      }

      //Återställer formuläret
      this.menuForm.reset();

      //Meddelandent nollställs efter 5 sekunder.
      setTimeout(() => {
        this.successCreate.set("")
      }, 5000);

    } catch (error: any) {

      if(error.status === 403) {
        //Om tokens giltigthetstid har passerat.
         this.errorCreate.set("Din inloggningsession har passerat. Vänligen logga in på nytt för att utföra åtgärden!");
      } else if (error.status === 409) {
        //Om menyartikel redan finns.
        this.errorCreate.set("Menyartikeln finns redan!");
      } else {
        this.errorCreate.set("Det gick inte att spara menyartikel. Försök igen senare.")
      }

      //Meddelandent nollställs efter 5 sekunder.
      setTimeout(() => {
        this.errorCreate.set("")
      }, 5000);


    }
  }




  //Vid start
  async ngOnInit() {

    try {

      //Laddar kategorier
      await this.categoryService.loadCategories();

      //Hämtar kategorier 
      const categoryList = this.categoryService.categories();

      //Kontroll om listan innehåller några kategorier
      if (categoryList.length > 0) {
        //Hämtar det första kategori id:et ur listan
        const firstIndex = categoryList[0].category_id;

        //Ändrar till första index och laddar menyartiklarna som tillhör kategorin.
        this.selectedCategory.set(firstIndex);
        this.menuItemService.loadMenuCategory(firstIndex);

      }

    } catch (error) {
      this.error.set("Menyerna kunde inte laddas. Försök igen senare.");
    }

  }

  //Ändra kategori med tillhörande meynartiklar.
  changeCategory(id: number) {
    this.selectedCategory.set(id);
    this.menuItemService.loadMenuCategory(id);
  }



  //Radera menyartikel
  async onDelete(itemId: number, itemName: string): Promise<void> {
    try {

      //Rensar tidigare meddelanden
      this.successDelete.set("");
      this.errorDelete.set("");


      await this.menuItemService.deleteMenuItem(itemId);

      //Meddelande vid radering
      this.successDelete.set(`Menyartikeln har raderats: ${itemName}`);

      //Meddelandent nollställs efter 5 sekunder.
      setTimeout(() => {
        this.successDelete.set("")
      }, 5000);

    } catch (error) {
      this.errorDelete.set("Det gick inte att radera menyartikeln. Försök igen senare.")


      //Meddelandent nollställs efter 5 sekunder.
      setTimeout(() => {
        this.errorDelete.set("")
      }, 5000);


    }
  }
}

