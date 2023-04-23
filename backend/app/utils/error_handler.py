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


def error_handler(exception):
    response = jsonify({"error": exception.message})
    response.statusCode = exception.statusCode

    return response
