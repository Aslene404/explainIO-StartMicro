import cv2
import easyocr


def image_to_text(image_path):
    image_path = 'test_german.png'
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

    # Step 2: Contrast Enhancement
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced_image = clahe.apply(image)

    # Step 3: Thresholding
    _, thresholded_image = cv2.threshold(enhanced_image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    # output_path = 'thresholded_image.jpg'
    # cv2.imwrite(output_path, thresholded_image)

    reader = easyocr.Reader(['de'], gpu=True)  # this needs to run only once to load the model into memory
    result = reader.readtext(thresholded_image, detail=0)
    for detection in result:
        print(detection)
    return result
