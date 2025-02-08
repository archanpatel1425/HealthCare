from flask import Flask, request, Response,jsonify
from flask.templating import render_template
from flask import request
from werkzeug.utils import secure_filename
from app import app
import torch
from PIL import Image
import torchvision.transforms as T
import numpy as np
import os
import skin_cancer_detection as SCD
def predict(model, img, tr, classes):
    img_tensor = tr(img)
    out = model(img_tensor.unsqueeze(0))
    pred, idx = torch.max(out, 1)
    return classes[idx]

def get_transforms():
    transform = []
    transform.append(T.Resize((512, 512)))
    transform.append(T.ToTensor())
    return T.Compose(transform)

@app.route('/', methods=['GET', 'POST'])
def home_page():
    return render_template("Home.html")


@app.route('/skin_disease', methods=['GET', 'POST'])
def skin_disease():
        # res = None
        # if request.method == 'POST':
        #     classes = ['acanthosis-nigricans',
        #             'acne',
        #             'acne-scars',
        #             'alopecia-areata',
        #             'dry',
        #             'melasma',
        #             'oily',
        #             'vitiligo',
        #             'warts']
        #     f = request.files['file']
        #     filename = secure_filename(f.filename)
        #     path = os.path.join(app.config['UPLOAD_PATH'], filename)
        #     f.save(path)
        #     model = torch.load('./skin-model-pokemon.pt', map_location=torch.device('cpu'))
        #     device = torch.device('cpu')
        #     model.to(device);
        #     img = Image.open(path).convert("RGB")
        #     tr = get_transforms()
        #     res = predict(model, img, tr, classes)

        # return render_template("skin_disease.html",res=res)
        try:
            classes = ['acanthosis-nigricans', 'acne', 'acne-scars', 'alopecia-areata',
                    'dry', 'melasma', 'oily', 'vitiligo', 'warts']
            
            if 'file' not in request.files:
                return jsonify({"error": "No file uploaded"}), 400
            
            f = request.files['file']
            filename = secure_filename(f.filename)
            path = os.path.join(app.config['UPLOAD_PATH'], filename)
            f.save(path)

            # Load the model
            model = torch.load('./skin-model-pokemon.pt', map_location=torch.device('cpu'))
            model.to(torch.device('cpu'))

            # Process the image
            img = Image.open(path).convert("RGB")
            tr = get_transforms()  # Ensure this function is defined
            res = predict(model, img, tr, classes)  # Ensure predict() is defined

            return jsonify({"prediction": res})  # Return JSON response
        
        except Exception as e:
            return jsonify({"error": str(e)}), 500
     
    
@app.route('/skin_cancer', methods=['GET', 'POST'])
def skin_cancer():
    # if request.method == 'POST':
    #     if 'pic' not in request.files:  # Check if file exists in request
    #         return "No file part", 400

    #     pic = request.files['pic']

    #     if pic.filename == '':  # Check if the file has a name
    #         return "No selected file", 400

    #     try:
    #         inputimg = Image.open(pic)
    #         inputimg = inputimg.convert("RGB")  # Convert to RGB to ensure 3 channels
    #         inputimg = inputimg.resize((28, 28))  # Resize image
    #         img = np.array(inputimg)  # Convert to NumPy array

    #         if img.shape != (28, 28, 3):  # Double-check shape
    #             return f"Error: Image shape is {img.shape}, expected (28,28,3)", 400

    #         img = img.reshape(-1, 28, 28, 3)  # Reshape for model input

    #         # Ensure SCD is properly defined
    #         if not hasattr(SCD, 'model') or not hasattr(SCD, 'classes'):
    #             return "Model is not loaded properly", 500

    #         result = SCD.model.predict(img)  # Predict
    #         result = result.tolist()
    #         max_prob = max(result[0])
    #         class_ind = result[0].index(max_prob)
    #         result_label = SCD.classes[class_ind]  # Get class name

    #         # Skin cancer descriptions
    #         descriptions = {
    #             0: "Actinic keratosis also known as solar keratosis or senile keratosis are names given to intraepithelial keratinocyte dysplasia. As such they are a pre-malignant lesion or in situ squamous cell carcinomas and thus a malignant lesion.",
    #             1: "Basal cell carcinoma is a type of skin cancer. Basal cell carcinoma begins in the basal cells — a type of cell within the skin that produces new skin cells as old ones die off.Basal cell carcinoma often appears as a slightly transparent bump on the skin, though it can take other forms. Basal cell carcinoma occurs most often on areas of the skin that are exposed to the sun, such as your head and neck",
    #             2: "Benign lichenoid keratosis (BLK) usually presents as a solitary lesion that occurs predominantly on the trunk and upper extremities in middle-aged women. The pathogenesis of BLK is unclear; however, it has been suggested that BLK may be associated with the inflammatory stage of regressing solar lentigo (SL)1",
    #             3: "Dermatofibromas are small, noncancerous (benign) skin growths that can develop anywhere on the body but most often appear on the lower legs, upper arms or upper back. These nodules are common in adults but are rare in children. They can be pink, gray, red or brown in color and may change color over the years. They are firm and often feel like a stone under the skin. ",
    #             4: "A melanocytic nevus (also known as nevocytic nevus, nevus-cell nevus and commonly as a mole) is a type of melanocytic tumor that contains nevus cells. Some sources equate the term mole with ‘melanocytic nevus’, but there are also sources that equate the term mole with any nevus form.",
    #             5: "Pyogenic granulomas are skin growths that are small, round, and usually bloody red in color. They tend to bleed because they contain a large number of blood vessels. They’re also known as lobular capillary hemangioma or granuloma telangiectaticum.",
    #             6: "Melanoma, the most serious type of skin cancer, develops in the cells (melanocytes) that produce melanin — the pigment that gives your skin its color. Melanoma can also form in your eyes and, rarely, inside your body, such as in your nose or throat. The exact cause of all melanomas isn't clear, but exposure to ultraviolet (UV) radiation from sunlight or tanning lamps and beds increases your risk of developing melanoma."
    #         }

    #         info = descriptions.get(class_ind, "No information available")

    #         return render_template("skin_cancer.html", result=result_label, info=info)

    #     except Exception as e:
    #         return f"Error processing image: {str(e)}", 500

    # return render_template("skin_cancer.html", result=None,info=None)
    
    if 'pic' not in request.files:
        return jsonify({"error": "No file part"}), 400

    pic = request.files['pic']

    if pic.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        inputimg = Image.open(pic)
        inputimg = inputimg.convert("RGB")  # Convert to RGB
        inputimg = inputimg.resize((28, 28))  # Resize
        img = np.array(inputimg)

        if img.shape != (28, 28, 3):
            return jsonify({"error": f"Invalid image shape: {img.shape}"}), 400

        img = img.reshape(-1, 28, 28, 3)  # Reshape for model input

        if not hasattr(SCD, 'model') or not hasattr(SCD, 'classes'):
            return jsonify({"error": "Model is not loaded properly"}), 500

        result = SCD.model.predict(img)
        result = result.tolist()
        max_prob = max(result[0])
        class_ind = result[0].index(max_prob)
        result_label = SCD.classes[class_ind]  # Get class name

        descriptions = {
                0: "Actinic keratosis also known as solar keratosis or senile keratosis are names given to intraepithelial keratinocyte dysplasia. As such they are a pre-malignant lesion or in situ squamous cell carcinomas and thus a malignant lesion.",
                1: "Basal cell carcinoma is a type of skin cancer. Basal cell carcinoma begins in the basal cells — a type of cell within the skin that produces new skin cells as old ones die off.Basal cell carcinoma often appears as a slightly transparent bump on the skin, though it can take other forms. Basal cell carcinoma occurs most often on areas of the skin that are exposed to the sun, such as your head and neck",
                2: "Benign lichenoid keratosis (BLK) usually presents as a solitary lesion that occurs predominantly on the trunk and upper extremities in middle-aged women. The pathogenesis of BLK is unclear; however, it has been suggested that BLK may be associated with the inflammatory stage of regressing solar lentigo (SL)1",
                3: "Dermatofibromas are small, noncancerous (benign) skin growths that can develop anywhere on the body but most often appear on the lower legs, upper arms or upper back. These nodules are common in adults but are rare in children. They can be pink, gray, red or brown in color and may change color over the years. They are firm and often feel like a stone under the skin. ",
                4: "A melanocytic nevus (also known as nevocytic nevus, nevus-cell nevus and commonly as a mole) is a type of melanocytic tumor that contains nevus cells. Some sources equate the term mole with ‘melanocytic nevus’, but there are also sources that equate the term mole with any nevus form.",
                5: "Pyogenic granulomas are skin growths that are small, round, and usually bloody red in color. They tend to bleed because they contain a large number of blood vessels. They’re also known as lobular capillary hemangioma or granuloma telangiectaticum.",
                6: "Melanoma, the most serious type of skin cancer, develops in the cells (melanocytes) that produce melanin — the pigment that gives your skin its color. Melanoma can also form in your eyes and, rarely, inside your body, such as in your nose or throat. The exact cause of all melanomas isn't clear, but exposure to ultraviolet (UV) radiation from sunlight or tanning lamps and beds increases your risk of developing melanoma."
            }
        info = descriptions.get(class_ind, "No information available")

        return jsonify({"result": result_label, "info": info})

    except Exception as e:
        return jsonify({"error": f"Error processing image: {str(e)}"}), 500

    
    
    
    
    
    
    
    
    
    # -----------------------------------------------------------------------------------------------------------
    # if request.method == 'POST':
    #     if 'pic' not in request.files:  # Check if file is in the request
    #         return "No file part", 400

    #     pic = request.files['pic']
    #     if pic.filename == '':  # Check if the file has a name
    #         return "No selected file", 400
    # # pic = request.files["pic"]
    # # print(pic)
    # inputimg = Image.open(pic)
    # inputimg = inputimg.resize((28, 28))
    # img = np.array(inputimg).reshape(-1, 28, 28, 3)
    # result = SCD.model.predict(img)

    # result = result.tolist()
    # print(result)
    # max_prob = max(result[0])
    # class_ind = result[0].index(max_prob)
    # print(class_ind)
    # result = SCD.classes[class_ind]

    # if class_ind == 0:
    #     info = "Actinic keratosis also known as solar keratosis or senile keratosis are names given to intraepithelial keratinocyte dysplasia. As such they are a pre-malignant lesion or in situ squamous cell carcinomas and thus a malignant lesion."

    # elif class_ind == 1:
    #     info = "Basal cell carcinoma is a type of skin cancer. Basal cell carcinoma begins in the basal cells — a type of cell within the skin that produces new skin cells as old ones die off.Basal cell carcinoma often appears as a slightly transparent bump on the skin, though it can take other forms. Basal cell carcinoma occurs most often on areas of the skin that are exposed to the sun, such as your head and neck"
    # elif class_ind == 2:
    #     info = "Benign lichenoid keratosis (BLK) usually presents as a solitary lesion that occurs predominantly on the trunk and upper extremities in middle-aged women. The pathogenesis of BLK is unclear; however, it has been suggested that BLK may be associated with the inflammatory stage of regressing solar lentigo (SL)1"
    # elif class_ind == 3:
    #     info = "Dermatofibromas are small, noncancerous (benign) skin growths that can develop anywhere on the body but most often appear on the lower legs, upper arms or upper back. These nodules are common in adults but are rare in children. They can be pink, gray, red or brown in color and may change color over the years. They are firm and often feel like a stone under the skin. "
    # elif class_ind == 4:
    #     info = "A melanocytic nevus (also known as nevocytic nevus, nevus-cell nevus and commonly as a mole) is a type of melanocytic tumor that contains nevus cells. Some sources equate the term mole with ‘melanocytic nevus’, but there are also sources that equate the term mole with any nevus form."
    # elif class_ind == 5:
    #     info = "Pyogenic granulomas are skin growths that are small, round, and usually bloody red in color. They tend to bleed because they contain a large number of blood vessels. They’re also known as lobular capillary hemangioma or granuloma telangiectaticum."
    # elif class_ind == 6:
    #     info = "Melanoma, the most serious type of skin cancer, develops in the cells (melanocytes) that produce melanin — the pigment that gives your skin its color. Melanoma can also form in your eyes and, rarely, inside your body, such as in your nose or throat. The exact cause of all melanomas isn't clear, but exposure to ultraviolet (UV) radiation from sunlight or tanning lamps and beds increases your risk of developing melanoma."

    # return render_template("skin_cancer.html", result=result, info=info)