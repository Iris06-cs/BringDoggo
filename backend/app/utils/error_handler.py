from flask import jsonify


class ValidationError(Exception):
    def __init__(self, message):
        self.message = message
        self.statusCode=400
        super().__init__(self.message,self.statusCode)


class NotFoundError(Exception):
    def __init__(self, message):
        self.message = message
        self.statusCode=404
        super().__init__(self.message,self.statusCode)


class ForbiddenError(Exception):
    def __init__(self, message):
        self.message = message
        self.statusCode=403
        super().__init__(self.message,self.statusCode)


class UnauthorizedError(Exception):
    def __init__(self, message):
        self.message = message
        self.statusCode=401
        super().__init__(self.message,self.statusCode)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

def error_handler(exception):
    response = jsonify({"error": exception.message})
    response.statusCode = exception.statusCode

    return response
