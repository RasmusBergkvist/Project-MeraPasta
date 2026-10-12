import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.interface';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-mange-category',
  styleUrl: './mange-category.scss',
  templateUrl: './mange-category.html',
})
export class MangeCategory {
  //Signals meddelanden
  errorCreate = signal<string>("");
  successCreate = signal<string>("");
  errorDelete = signal<string>("");
  successDelete = signal<string>("");

  //Signal redigering
  editId = signal<number | null>(null);

  //Hämtar service
  categoryService = inject(CategoryService);

  //Validering
  categoryForm = new FormGroup({
    category_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
  });

  //Hämta data till redigering
  getDataToEdit(category: Category) {
    //Uppdaterar signal med id
    this.editId.set(category.category_id);
    //Hämtar datan till formulärfält
    this.categoryForm.setValue({
      category_name: category.category_name
    });

  }


  async onSubmit() {
    //Om inte login-fält är korrekt ifyllt.
    if (this.categoryForm.invalid) {
      return;
    }
    try {
      //Rensar tidigare meddelanden
      this.successCreate.set("");
      this.errorCreate.set("");

      //Hämtar värden från kategoriformuläret enligt interface
      const categoryInput = this.categoryForm.value as Category;

      //Hämtar id vid redigering.
      const currentId = this.editId();

      if (currentId) {
        //Uppdaterar kategorin
        await this.categoryService.updateCategory(currentId, categoryInput);
        //Meddelande vid uppdaterad kategori.
        this.successCreate.set(`Menykategorin har uppdaterats: ${categoryInput.category_name}`);
        //Sätter signal till null.
        this.editId.set(null);
      } else {

        //Skapar kategori
        await this.categoryService.createCategory(categoryInput);

        //Meddelande vid skapad kategori.
        this.successCreate.set(`Menykategori skapad: ${categoryInput.category_name}`)

      }
      //Återställer formuläret
      this.categoryForm.reset();

      //Meddelandent nollställs efter 5 sekunder.
      setTimeout(() => {
        this.successCreate.set("")
      }, 5000);

    } catch (error: any) {
      if (error.status === 403) {
        //Om tokens giltigthetstid har passerat.
        this.errorCreate.set("Din inloggningsession har passerat. Vänligen logga in på nytt för att utföra åtgärden!");
      } else if (error.status === 409) {
        this.errorCreate.set("Kategori finns redan!");
        //Om kategori redan finns.
      } else {
        this.errorCreate.set("Det gick inte att spara kategori. Försök igen senare.")
      }

      //Meddelandent nollställs efter 5 sekunder.
      setTimeout(() => {
        this.errorCreate.set("")
      }, 5000);


    }
  }


  //vid start
  async ngOnInit() {
    await this.categoryService.loadCategories();

  }


  //Radera kategori
  async onDelete(categoryId: number, categoryName: string): Promise<void> {
    try {
      await this.categoryService.deleteCategory(categoryId);

      //Meddelande vid radering
      this.successDelete.set(`Kategorin har raderats: ${categoryName}`);

      //Meddelandent nollställs efter 5 sekunder.
      setTimeout(() => {
        this.successDelete.set("")
      }, 5000);

    } catch (error: any) {
      //Om användaren redan finns.
      this.errorDelete.set("Det gick inte att radera kategorin. Försök igen senare.")


      //Meddelandent nollställs efter 5 sekunder.
      setTimeout(() => {
        this.errorDelete.set("")
      }, 5000);


    }
  }


}
